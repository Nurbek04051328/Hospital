const Treatment = require("../models/treatment");
const decoded = require("../service/decoded");

const all = async (req, res) => {
    let userFunction = decoded(req,res);
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    next = (next-1)*quantity;
    let patsient = req.query.patsient || null;
    let doctor = req.query.doctor || null;
    let room = req.query.room || null;
    let treatments = [];
    let fil = {};
    if (patsient) fil = {...fil, patsient};
    if (doctor) fil = {...fil, doctor};
    if (room) fil = {...fil, room};
    treatments = await Treatment.find({ ...fil, userId:userFunction.id}).populate(['patsient', 'room', 'doctor']).sort({_id:-1}).limit(quantity)
        .skip(next).lean()
    treatments = treatments.map(treatment => {
        if (treatment.patsient && treatment.doctor && treatment.room) {
            treatment.patsient = treatment.patsient.name
            treatment.doctor = treatment.doctor.name
            treatment.room = treatment.room.number
        }
        return treatment
    })
    res.status(200).send(treatments)
}

const count = async (req, res) => {
    let userFunction = decoded(req,res)
    let count = await Treatment.find({userId: userFunction.id}).select('_id').count()
    res.send({count})
}

const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let treatment = await Treatment.findOne({_id}).lean()
            if(req.query.status) {
                treatment.status = parseInt(status)
            } else {
                treatment.status = spec.status == 0 ? 1 : 0
            }
            await Treatment.findByIdAndUpdate(_id,treatment)
            let saveTreatment = await Treatment.findOne({_id:_id}).populate(['patsient', 'room', 'doctor']).lean()
            if (saveTreatment.patsient && saveTreatment.doctor && saveTreatment.room) {
                saveTreatment.patsient = saveTreatment.patsient.name
                saveTreatment.doctor = saveTreatment.doctor.name
                saveTreatment.room = saveTreatment.room.number
            }
            res.status(200).send(saveTreatment)
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
        if (!req.body.patsient) {
            return res.status(400).send({message: 'Bemor kiritilmagan'})
        }
        if (!req.body.doctor) {
            return res.status(400).send({message: 'Doctor kiritilmagan'})
        }
        if (!req.body.room) {
            return res.status(400).send({message: 'xona kiritilmagan'})
        }
        const treatment = new Treatment({...req.body, createdTime: Date.now()})
        await treatment.save()
        let saveTreatment = await Treatment.findOne({_id:treatment._id}).populate(['patsient', 'room', 'doctor']).lean()
        if (saveTreatment.patsient && saveTreatment.doctor && saveTreatment.room) {
            saveTreatment.patsient = saveTreatment.patsient.name
            saveTreatment.doctor = saveTreatment.doctor.name
            saveTreatment.room = saveTreatment.room.number
        }

        res.status(201).send(saveTreatment)
    }
}

const update = async (req, res) => {
    if (req.body) {
        let { _id } = req.body;
        if (_id) {
            const treatment = await Treatment.findByIdAndUpdate({_id:req.body._id},{ ...req.body, updateTime:Date.now() })
            await treatment.save()
            let saveTreatment = await Treatment.findOne({_id:treatment._id}).populate(['patsient', 'room', 'doctor']).lean()
            if (saveTreatment.patsient && saveTreatment.doctor && saveTreatment.room) {
                saveTreatment.patsient = saveTreatment.patsient.name
                saveTreatment.doctor = saveTreatment.doctor.name
                saveTreatment.room = saveTreatment.room.number
            }
            res.send(saveTreatment)
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
        let treatment = await Treatment.findOne({_id,userId:userFunction.id}).populate(['patsient', 'room', 'doctor']).lean()
        res.status(200).send(treatment)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}

const edit = async (req, res) => {
    if (req.params.id) {
        const _id = req.params.id
        let userFunction = decoded(req,res)
        let treatment = await Treatment.findOne({_id,userId:userFunction.id}).lean()
        res.status(200).send(treatment)
    } else {
        res.status(500).send({message: "Не найдено"})
    }

}


const del = async(req,res)=>{
    if (req.params.id) {
        await Treatment.findByIdAndDelete(req.params.id)
        res.status(200).send({message:'Удалено!', data: req.params.id})
    } else {
        res.status(500).send({message: "Не найдено"})
    }
}


module.exports = { all, create, update, findOne, edit,count, changeStatus, del }