const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const decoded = require("../service/decoded");



const reg = async (req, res) => {
    if (req.body){
        let {login,password,name, avatar} = req.body
        if (login && password){
            let check = await User.findOne({login})
            if (!check){
                const hashPass = await bcrypt.hash(password, 10)
                let user =  await new User({login, password: hashPass,name})
                await user.save()
                res.status(201).send('success')
            } else {
                res.status(200).send('exist')
            }
        } else {
            res.status(200).send('required')
        }
        return true
    }
    res.status(200).send('empty')
}

const checkLogin = async(req,res) => {
    let {login} = req.body
    login = "+998 " + login
    const user = await User.findOne({login})
    if (user) {
        return res.status(400).json({message: "Пользователь с таким логином есть!"})
    } else {
        return res.status(200).json({message: "ок"})
    }
}


const update = async (req,res) => {
    try {
        if (req.body._id) {
            let { _id, login, password, name } = req.body;
            let user = await User.findOne({_id: _id});
            user.login = login;
            user.name = name;
            if(password) {
                const hashPass = await bcrypt.hash(password, 10);
                user.password = hashPass;
            }
            if (req.files){
                let file = req.files.avatar
                uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                filepath = `images/user/${uniquePreffix}_${file.name}`
                await file.mv(filepath)
                user.avatar.push(filepath, `images/user/${uniquePreffix}`)

            }
            await User.findByIdAndUpdate(user._id,user);
            let sendUser = await User.findOne({_id: _id}).select(['-password']).lean();
            res.status(200).json(sendUser);
        } else {
            res.status(500).json({message: "Не найдено id"});
        }
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}



const haveLogin = async (req,res) => {
    let { login } = req.body
    login = "+998 " + login
    let have = await User.findOne({login})
    if (have) {
        return res.status(200).send({message: "Пользователь с таким логином есть!"})
    }
    res.status(200).send({message:"ок"})
}

const login = async (req, res) => {
    console.log(req.body)
    let {login, password} = req.body
    const user = await User.findOne({login})
    if (!user) {
        return res.status(404).send('User topilmadi')
    }
    const isPassValid = bcrypt.compareSync(password, user.password)
    if (!isPassValid) {
        return res.status(400).send('Parolda xatolik bor')
    }
    const token = jwt.sign({id: user.id}, process.env.SecretKey, {expiresIn: "1d"})
    let data = {
        id: user.id,
        login: user.login,
        role: user.role,
        name: user.name
    }
    return res.status(200).send({
        token,
        user: data
    })
}

const checkUser = async (req,res) => {
    const user = await User.findOne({_id: req.user.id})
    if (!user){
        return res.status(404).json({message: "Пользователь не найдено!"})
    }
    let data = {
        id: user.id,
        login: user.login,
        role: user.role,
        name: user.name
    }
    res.status(200).json(data)
}

const find = async (req, res) => {
    let userFunction = decoded(req,res)
    const _id = userFunction.id
    let user = await User.findOne({_id,_id}).select(['-password']).lean()
    res.status(200).send(user)

}


const getUser = async (req, res) => {
    const user = await User.findOne({_id: req.user.id})
    const token = jwt.sign({id: user.id}, process.env.secretKey, {expiresIn: "1d"})
    return res.json({
        token,
        user: user
    })
}

module.exports = { reg, checkLogin, login, checkUser, haveLogin, getUser, update, find }