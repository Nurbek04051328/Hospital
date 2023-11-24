const multer = require('multer')
const storage = multer.diskStorage({
    destination(req,file,cb){ cb(null,'images') },
    filename(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g, '-')+'_'+file.originalname)
    }
})
const arrTypes = ['image/jpg','image/png','image/jpeg','image/svg+xml','image/webp','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel.sheet.binary.macroEnabled.12','application/vnd.ms-excel','application/vnd.ms-excel.sheet.macroEnabled.12']
const fileFilter = (req, file, cb) => {
    if (arrTypes.includes(file.mimetype)){ cb(null,true)
    } else { cb(null,false) }
}
module.exports = multer({ storage, fileFilter })