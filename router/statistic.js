const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { countDoctor, countPatsient, countRoom, countDepartment, allBudget, homePatsient, homeDoctor,all } = require('../controllers/statistic');

//doctorlar soni
router.get('/', auth,  all);
router.get('/doctor', auth,  countDoctor);
// Bemorlar soni
router.get('/patsient', auth,  countPatsient);
// Xonalar soni
router.get('/room', auth,  countRoom);
// Bo'limlar soni
router.get('/department', auth,  countDepartment);
// Budget
router.get('/budget', auth,  allBudget);
// home page uchun bemorlar
router.get('/homedoctor', auth,  homePatsient);
// Home page uchun doctorlar
router.get('/homepatsient', auth,  homeDoctor);






module.exports = router;