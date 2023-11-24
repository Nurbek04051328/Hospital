const Department = require("../models/department");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    let userFunction = decoded(req,res)
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    next = (next-1)*quantity;
    let title = req.query.title || null;
    let departments = [];
    let fil = {};
    let othername = kirilLotin.kirlot(title)
    if (title) {
        fil = {
            ...fil, $or: [
                {'title': {$regex: new RegExp(title.toLowerCase(), 'i')}},
                {'title': {$regex: new RegExp(othername.toLowerCase(), 'i')}},
            ]
        }
    }
    departments = await Department.find({ ...fil, userId: userFunction.id}).sort({_id:-1}).limit(quantity)
        .skip(next).lean()
    res.status(200).send(departments)
}

const count = async (req, res) => {
    let userFunction = decoded(req,res)
    let count = await Department.find({userId: userFunction.id}).select('_id').count()
    res.send({count})
}

const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let department = await Department.findOne({_id}).lean()
            if(req.query.status) {
                department.status = parseInt(status)
            } else {
                department.status = department.status == 0 ? 1 : 0
            }
            await Department.findByIdAndUpdate(_id,department)
            let saveDepartment = await Department.findOne({_id:_id}).lean()
            res.status(200).send(saveDepartment)
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
        const department = new Department({...req.body,createdTime: Date.now()})
        await department.save()
        res.status(201).send(department)
    }
}

const update = async (req, res) => {
    if (req.body) {
        let { _id } = req.body;
        if (_id) {
            const department = await Department.findByIdAndUpdate({_id:req.body._id},{ ...req.body, updateTime:Date.now() })
            await department.save()
            let upDepartmen = await Department.findOne({_id:department._id})
            res.send(upDepartmen)
        } else {
            res.status(500).send({message: "Id topilmadi"})
        }

    } else {
        res.status(500).send({message: "Не найдено"})
    }
}

const findOne = async (req, res) => {
    if (req.params.id) {
        let userFunction = decoded(req,res)
        const _id = req.params.id
        let department = await Department.findOne({_id,userId:userFunction.id}).lean()
        console.log(department)
        res.status(200).send(department)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}


const del = async(req,res)=>{
    if (req.params.id) {
        await Department.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Удалено!', data: req.params.id})
    } else {
        res.status(500).send({message: "Не найдено"})
    }
}




module.exports = { all, create, update, findOne, count, changeStatus, del }