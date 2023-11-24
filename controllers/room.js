const Room = require("../models/room");
const Department = require("../models/department");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");

const all = async (req, res) => {
    let userFunction = decoded(req,res);
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    next = (next-1)*quantity;
    let number = req.query.number || null;
    let department = req.query.department || null;
    let rooms = [];
    let fil = {};
    if (number) fil = {...fil, number};
    if (department) fil = {...fil, department};
    rooms = await Room.find({ ...fil, userId:userFunction.id}).sort({_id:-1}).populate(['department']).limit(quantity)
        .skip(next).lean()
    rooms = rooms.map(e => {
        if (e.department) {
            e.department = e.department.title
        }
        return e
    })
    res.status(200).send(rooms)
}

const count = async (req, res) => {
    let userFunction = decoded(req,res)
    let count = await Room.find({userId: userFunction.id}).select('_id').count()
    res.send({count})
}

const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let room = await Room.findOne({_id}).lean()
            if(req.query.status) {
                room.status = parseInt(status)
            } else {
                room.status = room.status == 0 ? 1 : 0
            }
            await Room.findByIdAndUpdate(_id,room)
            let saveRoom = await Room.findOne({_id:_id}).populate(['department']).lean()
            saveRoom.department = saveRoom.department.title
            res.status(200).send(saveRoom)
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
        if (!req.body.department) {
            return res.status(400).send({message: "Bo'limga biriktirilmagan"})
        }
        const room = new Room({...req.body, createdTime: Date.now()})
        await room.save()
        let saveRoom = await Room.findOne({_id:room._id}).populate(['department']).lean()
        if (saveRoom.department) {
            saveRoom.department = saveRoom.department.title
        }
        res.status(201).send(saveRoom)
    }
}

const update = async (req, res) => {
    if (req.body) {
        let { _id } = req.body;
        if (_id) {
            const room = await Room.findByIdAndUpdate({_id:req.body._id},{ ...req.body, updateTime:Date.now() })
            await room.save()
            let upRoom = await Room.findOne({_id:room._id}).populate(['department']).lean()
            if (upRoom.department) {
                upRoom.department = upRoom.department.title
            }
            res.send(upRoom)
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
        let room = await Room.findOne({_id,userId:userFunction.id}).lean()
        // room.department = room.department._id
        res.status(200).send(room)

    } else {
        res.status(500).send({message: "Не найдено"})
    }

}


const del = async(req,res)=>{
    if (req.params.id) {
        await Room.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Удалено!', data: req.params.id})
    } else {
        res.status(500).send({message: "Не найдено"})
    }
}


module.exports = { all, create, update, findOne, changeStatus, count, del }