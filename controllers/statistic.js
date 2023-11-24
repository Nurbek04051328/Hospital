const Treatment = require("../models/treatment");
const Department = require("../models/department");
const Doctor = require("../models/doctor");
const Patsient = require("../models/patsient");
const Room = require("../models/room");
const decoded = require("../service/decoded");

const countDoctor = async (req, res) => {
    let userFunction = decoded(req,res)
    let countDoctor = await Doctor.find({userId:userFunction.id}).count()
    if (countDoctor){
        res.send({countDoctor})
    } else {
        res.status(400).send({message:"Doctorlar topilmadi"})
    }

}

const countPatsient = async (req, res) => {
    let userFunction = decoded(req,res)
    let countPatsient = await Patsient.find({userId:userFunction.id}).count()
    res.status(200).send({countPatsient})
}

const countRoom = async (req, res) => {
    let userFunction = decoded(req,res)
    let countRoom = await Room.find({userId:userFunction.id}).count()
    res.status(200).send({countRoom})
}

const countDepartment = async (req, res) => {
    let userFunction = decoded(req,res)
    let countDepartment = await Department.find({userId:userFunction.id}).count()
    res.status(200).send({countDepartment})
}

const allBudget = async (req, res) => {
    let userFunction = decoded(req,res)
    let treatments = await Treatment.find({userId:userFunction.id}).lean()
    let summa = 0
    treatments = treatments.map(treatment => {
        summa =+ treatment.price
        return treatment
    })
    res.status(200).send(summa)
}


const homePatsient = async (req, res) => {
    let userFunction = decoded(req,res)
    let patsients = await Patsient.find({userId:userFunction.id}).populate(['department','doctor']).sort({_id:-1}).limit(7).lean()
    patsients = patsients.map(patsient => {
        patsient.department = patsient.department.title
        patsient.doctor = patsient.doctor.name
        return patsient
    })
    res.status(200).send(patsients)
}

const homeDoctor = async (req, res) => {
    let userFunction = decoded(req,res)
    let doctors = await Doctor.find({}).populate(['department','spec']).sort({_id:-1}).limit(7).lean()
    doctors = doctors.map(doctor => {
        doctor.department = doctor.department.title
        doctor.spec = doctor.spec.title
        return doctor
    })
    res.status(200).send(doctors)
}


const all = async (req,res) => {
    let userFunction = decoded(req,res)

    let countDoctors = await Doctor.find({userId:userFunction.id}).count()
    let countPatsient = await Patsient.find({userId:userFunction.id}).count()
    let countRoom = await Room.find({userId:userFunction.id}).count()
    let treatments = await Treatment.find({userId:userFunction.id}).lean()
    let summa = 0
    treatments = treatments.forEach(treatment => {
        summa += treatment.price
    })

    let patsients = await Patsient.find({userId:userFunction.id}).populate(['department','doctor']).sort({_id:-1}).limit(7).lean()
    patsients = patsients.map(patsient => {
        patsient.department = patsient.department?.title || ''
        patsient.doctor = patsient.doctor.name
        return patsient
    })

    let doctors = await Doctor.find({userId:userFunction.id}).populate(['department','spec']).sort({_id:-1}).limit(7).lean()
    doctors = doctors.map(doctor => {
        doctor.department = doctor.department.title
        doctor.spec = doctor.spec.title
        return doctor
    })

    res.send({countDoctors,countPatsient,countRoom,summa,patsients,doctors})
}




module.exports = { countDoctor, countPatsient, countRoom, countDepartment, allBudget, homePatsient, homeDoctor,all }