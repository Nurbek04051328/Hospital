const Spec = require("../models/spec");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    let userFunction = decoded(req,res);
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    next = (next-1)*quantity;
    let title = req.query.title || null;
    let spec = [];
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
    spec = await Spec.find({  ...fil, userId:userFunction.id}).sort({_id:-1}).limit(quantity)
        .skip(next).lean()
    res.status(200).send(spec)
}

const count = async (req, res) => {
    let userFunction = decoded(req,res)
    let count = await Spec.find({userId: userFunction.id}).select('_id').count()
    res.send({count})
}

const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let spec = await Spec.findOne({_id}).lean()
            if(req.query.status) {
                spec.status = parseInt(status)
            } else {
                spec.status = spec.status == 0 ? 1 : 0
            }
            await Spec.findByIdAndUpdate(_id,spec)
            let saveSpec = await Spec.findOne({_id:_id}).lean()
            res.status(200).send(saveSpec)
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
        const spec = new Spec({...req.body, createdTime: Date.now()})
        await spec.save()
        res.status(201).send(spec)
    }
}

const update = async (req, res) => {
    if (req.body) {
        let { _id } = req.body;
        if (_id) {
            const spec = await Spec.findByIdAndUpdate({_id:req.body._id},{ ...req.body, updateTime:Date.now() })
            await spec.save()
            let upSpec = await Spec.findOne({_id:spec._id})
            res.send(upSpec)
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
        let spec = await Spec.findOne({_id,userId:userFunction.id}).lean()
        res.status(200).send(spec)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}


const del = async(req,res)=>{
    if (req.params.id) {
        await Spec.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Удалено!', data: req.params.id})
    } else {
        res.status(500).send({message: "Не найдено"})
    }
}


module.exports = { all, create, update, findOne, changeStatus, count, del }