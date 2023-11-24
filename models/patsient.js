const {Schema, model} = require('mongoose')

const patsient = new Schema({
    userId: String,
    name: String,
    avatar: String,
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    //kelgan sana
    arriveDate: String,
    // chiqish sanasi
    releaseDate: String,
    // murojaat sababi
    diagnos: String,
    birthday: String,
    phone: String,
    gender: Number, // 1-erkak, 2- ayol
    //oilaviy holati
    married: Number,  //1-tushmushga chiqqan, 2-uylangan, 3-turmushga chiqmagan, 4-uylanmagan
    region: String,
    district: String,
    // ma'lumoti
    education: String,
    // bandlik holati
    employment: Number, // 1-ishlaydi  2- ishsiz
    workplace: String,
    familyphone: String,
    address:String,
    // Tibbiy ma'lumotlar
    //qon guruhi
    bloodtype: Number,
    // RH faktor
    factor: String,
    // sugurta polisi
    policy: String,
    // sugurta firmasi
    policecompany:String,
    // Imtiyoz kategoriyasi
    privilege: String,
    // imtiyoz hujjati
    privilegeDoc: String,
    // Imtiyoz hujjati olingan sana
    privilegeDate: String,
    // invalidligi
    invalid: Number,
    // vazni
    weight: Number,
    // bo'yi
    height: Number,
    // Allergik reaksiyalari
    reactions: String,
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


// 1 -erkak
// 2 - ayol

module.exports = model('Patsient', patsient)
