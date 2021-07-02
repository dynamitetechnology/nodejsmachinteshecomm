const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const saltRounds = 10;
const bcrypt = require('bcrypt');

const {
    check,
    validationResult
} = require('express-validator');


router.get('/login', controller.getuserLogin);
router.post('/login', [check('username', 'Invalid email.').exists().notEmpty().trim().isEmail().normalizeEmail().escape(),
check('password', 'password incorrect').exists().notEmpty().trim().isEmail().normalizeEmail().escape()], controller.userLogin);

router.get('/regpage', controller.getRegPage);
router.post('/register',controller.register)



// router.post('/register', [
//     check('name', 'Name Must Not Be Eempty').exists().notEmpty().trim().isLength({min: 2}).escape(),
//     check('phone', 'Phone Number Must Not Be Empty.').exists().notEmpty().trim().escape(),
//     check('email', 'Invalid email.').exists().notEmpty().trim().isEmail().normalizeEmail().escape(),
//     check('password', 'Invalid password: Minimum 6 characters required').exists().notEmpty().trim().isLength({min: 6}).escape()], controller.register);






router.get('/logout', controller.logout);



module.exports = router;