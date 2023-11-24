const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { all, create, update, count, findOne, del, edit } = require('../controllers/historyDoctor');


router.get('/:id', auth,  all);

router.get("/edit/:id", auth, edit);
router.get('/:id/count', auth,  count);

router.post("/", auth, create);

router.get("/find/:id", auth, findOne);

router.put('/', auth, update);

router.delete('/:id', auth,  del);




module.exports = router;