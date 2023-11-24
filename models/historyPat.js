const {Schema, model} = require('mongoose')

const historyPatsient = new Schema({
    userId: String,
    patsient: {
        type: Schema.Types.ObjectId,
        ref: 'Patsient'
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    //Kasallik turi
    diagnosType: String,
    // Diagnoz
    diagnos: String,
    // Davolanish sanasi
    date: String,

    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('HistoryPatsient',historyPatsient)