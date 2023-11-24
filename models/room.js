const {Schema, model} = require('mongoose')

const room = new Schema({
    userId: String,
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    number: String,
    maxcount: String,
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('Room',room)