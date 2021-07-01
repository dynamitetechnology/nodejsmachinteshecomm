const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');

const { check, validationResult} = require('express-validator');

router.get('/', controller.getDashboard);

router.post('/getuserdetail', controller.getuserdetail);

router.post('/postadd', controller.addpost);

router.post('/userpostlist',controller.userpostlist)


module.exports = router;
