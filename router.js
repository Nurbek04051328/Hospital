const {Router} = require('express');
const router = Router();


router.use('/auth', require("./router/auth"));
// router.use('/user', require("./router/user"));
router.use('/department', require("./router/department"));
router.use('/spec', require("./router/spec"));
router.use('/room', require("./router/room"));
router.use('/doctor', require("./router/doctor"));
router.use('/position', require("./router/position"));
router.use('/history', require("./router/historyDoctor"));
router.use('/patsient', require("./router/patsient"));
router.use('/historypatsient', require("./router/historyPat"));
router.use('/treatment', require("./router/treatment"));
router.use('/statistic', require("./router/statistic"));



module.exports = router