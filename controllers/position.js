const Position = require("../models/position");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");

const all = async (req, res) => {
    let userFunction = decoded(req,res)
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    next = (next-1)*quantity;
    let title = req.query.title || null;
    let position = [];
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
    position = await Position.find({...fil, userId:userFunction.id}).sort({_id:-1}).limit(quantity)
        .skip(next).lean()
    res.status(200).send(position)
}


const count = async (req, res) => {
    let userFunction = decoded(req,res)
    let count = await Position.find({userId: userFunction.id}).select('_id').count()
    res.send({count})
}


const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let position = await Position.findOne({_id}).lean()
            if(req.query.status) {
                position.status = parseInt(status)
            } else {
                position.status = position.status == 0 ? 1 : 0
            }
            await Position.findByIdAndUpdate(_id,position)
            let savePosition = await Position.findOne({_id:_id}).lean()
            res.status(200).send(savePosition)
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
        const position = new Position({...req.body, createdTime: Date.now()})
        await position.save()
        res.status(201).send(position)
    }
}

const update = async (req, res) => {
    if (req.body) {
        let { _id } = req.body;
        if (_id) {
            const position = await Position.findByIdAndUpdate({_id:req.body._id},{ ...req.body, updateTime:Date.now() })
            await position.save()
            let upPosition = await Position.findOne({_id:position._id})
            res.send(upPosition)
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
        let position = await Position.findOne({_id,userId:userFunction.id}).lean()
        res.status(200).send(position)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}


const del = async(req,res)=>{
    if (req.params.id) {
        await Position.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Удалено!', data: req.params.id})
    } else {
        res.status(500).send({message: "Не найдено"})
    }
}


module.exports = { all, create, update, findOne, count, changeStatus, del }