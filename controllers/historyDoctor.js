const History = require("../models/historyDoctor");
const Doctor = require("../models/doctor");
const decoded = require("../service/decoded");

const all = async (req, res) => {
    let userFunction = decoded(req,res);
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 0;
    const id = req.params.id
    let histories = await History.find({doctor:id,userId:userFunction.id}).populate(['doctor','position']).sort({_id:-1}).limit(quantity)
        .skip(next).lean()
    histories = histories.map(history => {
        if (history.position) {
            history.position = history.position.title
        }
        return history
    })
    res.status(200).send(histories)
}


const count = async (req, res) => {
    let userFunction = decoded(req,res)
    let count = await History.find({userId: userFunction.id}).select('_id').count()
    res.send({count})
}



const create = async (req, res) => {
    let userFunction = decoded(req,res)
    if (req.body) {
        req.body.userId = userFunction.id
        if (!req.body.position) {
            return res.status(400).send({message: 'Lavozim kiritilmagan'})
        }
        if (!req.body.doctor) {
            return res.status(400).send({message: "Doctorga biriktirilmagan"})
        }
        const history = new History({...req.body, createdTime: Date.now()})
        await history.save()
        let saveHistory = await History.findOne({_id:history._id}).populate(['doctor','position']).lean()
        if (saveHistory.position) {
            saveHistory.position = saveHistory.position.title
        }
        res.status(201).send(saveHistory)
    }
}

const update = async (req, res) => {
    if (req.body) {
        let { _id } = req.body;
        if (_id) {
            const history = await History.findByIdAndUpdate({_id:req.body._id},{ ...req.body, updateTime:Date.now() })
            await history.save()
            let saveHistory = await History.findOne({_id:history._id}).populate(['doctor','position']).lean()
            if (saveHistory.position) {
                saveHistory.position = saveHistory.position.title
            }
            res.send(saveHistory)
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
        let history = await History.findOne({_id,userId:userFunction.id}).populate(['doctor','position']).lean()
        res.status(200).send(history)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}


const edit = async (req, res) => {
    if (req.params.id) {
        let userFunction = decoded(req,res)
        const _id = req.params.id
        let history = await History.findOne({_id,userId:userFunction.id}).lean()
        res.status(200).send(history)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}

const del = async(req,res)=>{
    if (req.params.id) {
        await History.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Удалено!', data: req.params.id})
    } else {
        res.status(500).send({message: "Не найдено"})
    }
}


module.exports = { all, create, update, findOne, count, del, edit }