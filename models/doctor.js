const {Schema, model} = require('mongoose')

const mentor = new Schema({
    userId: String,
    name: String,
    avatar: String,
    place: String,
    phone: String,
    gender: Number,
    file:[],
    spec: {
        type: Schema.Types.ObjectId,
        ref: 'Spec'
    },
    birthday: String,
    education: String,
    createdTime: Date,
    updateTime: Date,
    region: String,
    district: String,
    family: Number,
    lvl: Number,
    familyphone: String,
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    exp:Number,
    worktime:Number,
    // weekdays:[Number],
    startTime:String,
    status: {
        type: Number,
        default: 1
    }
})


// 1 -erkak
// 2 - ayol

module.exports = model('Mentor', mentor)