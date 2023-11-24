const Department = require("../models/department");
const Doctor = require("../models/doctor");
const Patsient = require("../models/patsient");
const decoded = require("../service/decoded");
const fs = require('fs');
const ExcelJs = require('exceljs');
const path = require("path");
const reader = require('xlsx');
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    let userFunction = decoded(req,res);
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    next = (next-1)*quantity;
    let name = req.query.name || null;
    let department = req.query.department || null;
    let doctor = req.query.doctor || null;
    let patsients = [];
    let fil = {};
    let othername = kirilLotin.kirlot(name)
    if (name) {
        fil = {
            ...fil, $or: [
                {'name': {$regex: new RegExp(name.toLowerCase(), 'i')}},
                {'name': {$regex: new RegExp(othername.toLowerCase(), 'i')}},
            ]
        }
    }
    if (department) fil = {...fil, department};
    if (doctor) fil = {...fil, doctor};
    patsients = await Patsient.find({ ...fil, userId:userFunction.id}).populate(['department','doctor']).sort({_id:-1}).limit(quantity)
        .skip(next).lean()
    patsients = patsients.map(patsient => {
        if (patsient.department && patsient.doctor) {
            patsient.department = patsient.department.title
            patsient.doctor = patsient.doctor.name
        }

        return patsient
    })
    res.status(200).send(patsients)
}

const count = async (req, res) => {
    let userFunction = decoded(req,res)
    let count = await Patsient.find({userId: userFunction.id}).select('_id').count()
    res.send({count})
}


const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let patsient = await Patsient.findOne({_id}).lean()
            if(req.query.status) {
                patsient.status = parseInt(status)
            } else {
                patsient.status = patsient.status == 0 ? 1 : 0
            }
            await Patsient.findByIdAndUpdate(_id,patsient)
            let savePatsient = await Patsient.findOne({_id:_id}).populate(['department','doctor']).lean()
            if (savePatsient.department && savePatsient.doctor) {
                savePatsient.department = savePatsient.department.title
                savePatsient.doctor = savePatsient.doctor.name
            }
            res.status(200).send(savePatsient)
        } else {
            res.ststus(400).send({message: "Id не найдено"})
        }
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}




const create = async (req, res) => {
    let userFunction = decoded(req,res)
    if (req.body) {
        req.body.userId = userFunction.id
        req.body.userId = userFunction.id
        if (req.files){
            let file = req.files.avatar
            uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            filepath = `images/${uniquePreffix}_${file.name}`
            await file.mv(filepath)
            req.body.avatar = filepath, `images/${uniquePreffix}`

        }
        if (!req.body.department) {
            return res.status(400).send({message: "Bo'lim  biriktirilmagan"})
        }
        if (!req.body.doctor) {
            return res.status(400).send({message: "Doktor biriktirilmagan"})
        }

        const patsient = new Patsient({...req.body, createdTime: Date.now()})
        await patsient.save()
        let savePatsient = await Patsient.findOne({_id:patsient._id}).populate(['department','doctor']).lean()
        if (savePatsient.department && savePatsient.doctor) {
            savePatsient.department = savePatsient.department.title
            savePatsient.doctor = savePatsient.doctor.name
        }

        res.status(201).send(savePatsient)
    }
}

const update = async (req, res) => {
    if (req.body) {
        let { _id } = req.body;
        if (_id) {
            if (req.files){
                let file = req.files.avatar
                uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                filepath = `images/${uniquePreffix}_${file.name}`
                await file.mv(filepath)
                req.body.avatar = filepath, `images/${uniquePreffix}`

            }
            const patsient = await Patsient.findByIdAndUpdate({_id:req.body._id},{ ...req.body, updateTime:Date.now() })
            await patsient.save()
            let savePatsient = await Patsient.findOne({_id:patsient._id}).populate(['department','doctor']).lean()
            if (savePatsient.department && savePatsient.doctor) {
                savePatsient.department = savePatsient.department.title
                savePatsient.doctor = savePatsient.doctor.name
            }
            res.send(savePatsient)
        } else {
            res.status(500).send({message: "Id topilmadi"})
        }

    } else {
        res.status(500).send({message: "Не найдено"})
    }
}

const findOne = async (req, res) => {
    if (req.params.id) {
        const _id = req.params.id
        let userFunction = decoded(req,res)
        let patsient = await Patsient.findOne({_id,userId:userFunction.id}).lean()
        res.status(200).send(patsient)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}

const show = async (req, res) => {
    if (req.params.id) {
        const _id = req.params.id
        let userFunction = decoded(req,res)
        let patsient = await Patsient.findOne({_id,userId:userFunction.id}).populate(['department','doctor']).lean()
        res.status(200).send(patsient)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}

const del = async(req,res)=>{
    if (req.params.id) {
        await Patsient.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Удалено!', data: req.params.id})
    } else {
        res.status(500).send({message: "Не найдено"})
    }
}


// EXCELL

const excell = async (req, res, next) => {
    try {
        let userFunction = decoded(req,res)
        let patsients = await Patsient.find({userId:userFunction.id}).populate(['department','doctor']).sort({_id:-1}).lean()
        // let count = await Book.find().select(['_id']).count()
        const workbook = new ExcelJs.Workbook()
        const worksheet = workbook.addWorksheet('Document');

        worksheet.columns = [
            {header: 'N', key: 'id', width: 10},
            {header: 'Bemor ismi', key: 'name', width: 50},
            {header: 'Telefon raqami', key: 'phone', width: 50},
            {header: 'Bo`lim', key: 'department', width: 50},
            {header: 'Masul doctor', key: 'doctor', width: 50},
            {header: 'Kelgan sanasi', key: 'arriveDate', width: 50},
            {header: 'Tashxis', key: 'diagnos', width: 50},
            {header: 'Manzili', key: 'address', width: 50},
        ];
        if (patsients.length>0) {
            patsients.forEach((patsient, index) => {

                worksheet.addRow({
                    id: index + 1,
                    name: patsient.name,
                    phone: patsient.phone,
                    department: patsient.department?.title || '',
                    doctor: patsient.doctor?.name || '',
                    arriveDate: patsient.arriveDate,
                    diagnos: patsient.diagnos,
                    address: patsient.address,


                })


            })
        }
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = {bold: true};
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        let rows = worksheet.getRows(2, patsients.length)
        rows.forEach(el=>{
            el.eachCell((cell)=> {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        })
        let filename = path.join(__dirname, '../files/excel', `${userFunction.id}.xlsx`)
        await workbook.xlsx.writeFile(filename)
        res.status(200).send(`files/excel/${userFunction.id}.xlsx`)
    } catch (e) {
        console.log(e)
        res.status(500).send({message: "Serverda xatolik"})
    }
}


module.exports = { all,show, create, update, findOne, count, changeStatus, del, excell }