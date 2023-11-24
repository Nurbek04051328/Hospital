const {Schema, model} = require('mongoose')

const treatment = new Schema({
    userId: String,
    patsient: {
        type: Schema.Types.ObjectId,
        ref: 'Patsient'
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    // sana
    date: String,
    comment: String,
    price: Number,
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('Treatment',treatment)