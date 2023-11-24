const HistoryPatsient = require("../models/historyPat");
const Doctor = require("../models/doctor");
const decoded = require("../service/decoded");
// const User = require("./models/user");

const all = async (req, res) => {
    let userFunction = decoded(req,res);
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    const id = req.params.id
    let histories = await HistoryPatsient.find({patsient:id,userId:userFunction.id}).populate(['doctor', 'patsient']).sort({_id:-1}).limit(quantity)
        .skip(next).lean()
    histories = histories.map(history => {
        if (history.doctor) {
            history.doctor = history.doctor.name
        }
        return history
    })
    res.status(200).send(histories)
}

const create = async (req, res) => {
    let userFunction = decoded(req,res)
    if (req.body) {
        req.body.userId = userFunction.id;
        if (!req.body.patsient) {
            return res.status(400).send({message: "Bemorga  biriktirilmagan"})
        }
        if (!req.body.doctor) {
            return res.status(400).send({message: "Doktor biriktirilmagan"})
        }
        const history = new HistoryPatsient({...req.body, createdTime: Date.now()})
        await history.save()
        let saveHistory = await HistoryPatsient.findOne({_id:history._id}).populate(['doctor']).lean()
        if (saveHistory.doctor) {
            saveHistory.doctor = saveHistory.doctor.name
        }

        res.status(201).send(saveHistory)
    }
}

const update = async (req, res) => {
    if (req.body) {
        let { _id } = req.body;
        if (_id) {
            const history = await HistoryPatsient.findByIdAndUpdate({_id:req.body._id},{ ...req.body, updateTime:Date.now() })
            await history.save()
            let saveHistory = await HistoryPatsient.findOne({_id:history._id}).populate(['doctor']).lean()
            if (saveHistory.doctor) {
                saveHistory.doctor = saveHistory.doctor.name
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
        let history = await HistoryPatsient.findOne({_id,userId:userFunction.id}).lean()
        res.status(200).send(history)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}

const edit = async (req, res) => {
    if (req.params.id) {
        let userFunction = decoded(req,res)
        const _id = req.params.id
        let history = await HistoryPatsient.findOne({_id,userId:userFunction.id}).lean()
        res.status(200).send(history)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}


const del = async(req,res)=>{
    if (req.params.id) {
        await HistoryPatsient.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Удалено!', data: req.params.id})
    } else {
        res.status(500).send({message: "Не найдено"})
    }
}


module.exports = { all, create, update, findOne, del, edit }