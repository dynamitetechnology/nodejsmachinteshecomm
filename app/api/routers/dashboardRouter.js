const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');

const { check, validationResult} = require('express-validator');

router.get('/dashboard', controller.getDashboard);

router.get('/addproduct', controller.addproduct)

router.post('/getuserdetail', controller.getuserdetail);

router.post('/postadd', controller.addpost);

router.post('/userpostlist',controller.userpostlist)

//router.get('/dashboard',controller.dashboard)

module.exports = router;
