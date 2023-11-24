const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { all, create, update, findOne,edit, count, changeStatus, del } = require('../controllers/treatment');


router.get('/', auth,  all);

router.get('/count', auth,  count);

router.post("/", auth, create);

router.get("/show/:id", auth, findOne);

router.get("/:id", auth, edit);

router.get("/change/:id", auth, changeStatus);

router.put('/', auth, update);

router.delete('/:id', auth,  del);




module.exports = router;