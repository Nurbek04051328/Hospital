const Spec = require("../models/spec");
const Doctor = require("../models/doctor");
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
    let spec = req.query.spec || null;
    let doctors = [];
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
    if (spec) fil = {...fil, spec};
    doctors = await Doctor.find({ ...fil, userId:userFunction.id}).populate(['department','spec']).sort({_id:-1}).limit(quantity)
        .skip(next).lean()
    doctors = doctors.map(doctor => {
        if (doctor.department && doctor.spec ) {
            doctor.department = doctor.department.title
            doctor.spec = doctor.spec.title
        }
        return doctor
    })
    res.status(200).send(doctors)
}


const count = async (req, res) => {
    let userFunction = decoded(req,res)
    let count = await Doctor.find({userId: userFunction.id}).select('_id').count()
    res.send({count})
}


const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let doctor = await Doctor.findOne({_id}).lean()
            if(req.query.status) {
                doctor.status = parseInt(status)
            } else {
                doctor.status = doctor.status == 0 ? 1 : 0
            }
            await Doctor.findByIdAndUpdate(_id,doctor)
            let saveDoctor = await Doctor.findOne({_id:_id}).populate(['department','spec']).lean()
            if (saveDoctor.department && saveDoctor.spec ) {
                saveDoctor.department = saveDoctor.department.title
                saveDoctor.spec = saveDoctor.spec.title
            }
            res.status(200).send(saveDoctor)
        } else {
            res.ststus(400).send({message: "Id не найдено"})
        }
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const create =  async (req, res) => {
    let userFunction = decoded(req,res)
    if (req.body) {
        
        req.body.userId = userFunction.id;
        if (req.files){
            let file = req.files.file
            uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            filepath = `images/${uniquePreffix}_${file.name}`
            await file.mv(filepath)
            req.body.file = filepath, `images/${uniquePreffix}`

        }
        if (!req.body.spec) {
            return res.status(400).send({message: 'Mutaxasisligi kiritilmagan'})
        }
        if (!req.body.department) {
            return res.status(400).send({message: "Bo'lim kiritilmagan"})
        }
        const doctor = new Doctor({...req.body, createdTime: Date.now()})
        await doctor.save()
        let saveDoctor = await Doctor.findOne({_id:doctor._id}).populate(['spec','department']).lean()
        if (saveDoctor.spec && saveDoctor.department) {
            saveDoctor.spec = saveDoctor.spec.title
            saveDoctor.department = saveDoctor.department.title
        }
        res.status(201).send(saveDoctor)
    }
}

const update = async (req, res) => {
    if (req.body) {
        let { _id } = req.body;
        if (_id) {
            console.log(req.files)
            if (req.files){
                let file = req.files.file
                uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                filepath = `images/${uniquePreffix}_${file.name}`
                await file.mv(filepath)
                req.body.file = filepath, `images/${uniquePreffix}`

            }
            await Doctor.findByIdAndUpdate({_id:req.body._id},{ ...req.body, updateTime:Date.now() })
            let saveDoctor = await Doctor.findOne({_id}).populate(['spec','department']).lean()
            if (saveDoctor.spec && saveDoctor.department) {
                saveDoctor.spec = saveDoctor.spec.title
                saveDoctor.department = saveDoctor.department.title
            }
            res.send(saveDoctor)
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
        let doctor = await Doctor.findOne({_id,userId:userFunction.id}).populate(['department','spec']).lean()
        res.status(200).send(doctor)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}

const edit = async (req, res) => {
    if (req.params.id) {
        const _id = req.params.id
        let userFunction = decoded(req,res)
        let doctor = await Doctor.findOne({_id,userId:userFunction.id}).lean()
        res.status(200).send(doctor)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}


const del = async(req,res)=>{
    if (req.params.id) {
        await Doctor.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Удалено!', data: req.params.id})
    } else {
        res.status(500).send({message: "Не найдено"})
    }
}




// EXCELL

const excell = async (req, res, next) => {
    try {
        let userFunction = decoded(req,res)
        let doctors = await Doctor.find({userId:userFunction.id}).populate(['department','spec']).sort({_id:-1}).lean()
        // let count = await Book.find().select(['_id']).count()
        const workbook = new ExcelJs.Workbook()
        const worksheet = workbook.addWorksheet('Document');

        worksheet.columns = [
            {header: 'N', key: 'id', width: 10},
            {header: 'Doktor ismi', key: 'name', width: 70},
            {header: 'Telefon raqami', key: 'phone', width: 50},
            {header: 'Bo`lim', key: 'department', width: 50},
            {header: 'Mutaxasisligi', key: 'spec', width: 50},
            {header: 'Tug`ilgan sanasi', key: 'birthday', width: 50},
        ];
        if (doctors.length>0) {
            doctors.forEach((doctor, index) => {

                    worksheet.addRow({
                        id: index + 1,
                        name: doctor.name,
                        phone: doctor.phone,
                        department: doctor.department?.title || '',
                        spec: doctor.spec?.title || '',
                        birthday: doctor.birthday,


                    })


            })
        }
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = {bold: true};
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        let rows = worksheet.getRows(2, doctors.length)
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



module.exports = { all, create, update, findOne, count, changeStatus, del, edit, excell }