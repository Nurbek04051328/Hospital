const {Schema, model} = require('mongoose')

const position = new Schema({
    userId: String,
    title: String,
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('Position', position)