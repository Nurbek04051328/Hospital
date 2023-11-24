const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { all, create, update, findOne, show, count, changeStatus, del, excell } = require('../controllers/patsient');


router.get('/', auth,  all);

router.post("/", auth, create);

router.get("/excel", excell);

router.get("/count", auth, count);
router.get("/show/:id", auth, show);
router.get("/:id", auth, findOne);

router.get("/change/:id", auth, changeStatus);

router.put('/', auth, update);

router.delete('/:id', auth,  del);




module.exports = router;