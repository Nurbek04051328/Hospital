const {Schema, model} = require('mongoose')

const department = new Schema({
    userId: String,
    title: String,
    boss: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('Department',department)