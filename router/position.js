const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { all, create, update, findOne, count, changeStatus, del } = require('../controllers/position');


router.get('/', auth,  all);

router.get('/count', auth,  count);

router.post("/", auth, create);

router.get("/:id", auth, findOne);

router.get("/change/:id", auth, changeStatus);

router.put('/', auth, update);

router.delete('/:id', auth,  del);




module.exports = router;