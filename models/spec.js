const {Schema, model} = require('mongoose')

const spec = new Schema({
    userId: String,
    title: String,
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('Spec', spec)