const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { all, create, update, findOne, del,edit } = require('../controllers/historyPat');


router.get('/:id', auth,  all);

router.post("/", auth, create);
router.get("/edit/:id", auth, edit);
router.get("/find/:id", auth, findOne);

router.put('/', auth, update);

router.delete('/:id', auth,  del);




module.exports = router;