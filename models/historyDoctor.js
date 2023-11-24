const {Schema, model} = require('mongoose')

const historyDoctor = new Schema({
    userId: String,
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    position: {
        type: Schema.Types.ObjectId,
        ref: 'Position'
    },
    //Muassasa nomi
    title: String,
    // Ish boshlagan vaqti
    startDate: String,
    // Ishdan ketgan vaqti
    endDate: String,
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('HistoryDoctor',historyDoctor)