const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
// const upload = require('../middleware/file')
const { all, create, update, findOne, count, changeStatus, del, edit, excell } = require('../controllers/doctor');


router.get('/', auth,  all);

router.post("/",  auth,  create);

router.get("/excel", excell);

router.get("/count", auth, count);

router.get("/show/:id", auth, findOne);

router.get("/:id", auth, edit);



router.get("/change/:id", auth, changeStatus);

router.put('/', auth, update);

router.delete('/:id', auth,  del);




module.exports = router;