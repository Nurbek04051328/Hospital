const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { checkLogin, login, checkUser, haveLogin, getUser, reg, update, find } = require("../controllers/auth");



router.post('/checkuser',auth, checkUser);

router.post('/checklogin',auth, checkLogin);

router.post('/reg',reg);

router.put('/update',update);

router.get('/find',find);

router.post('/havelogin',auth, haveLogin);

router.post('/login', login);

router.get('/getuser', auth, getUser);


module.exports = router;