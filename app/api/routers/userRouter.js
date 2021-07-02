const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const multer = require("multer");
const path = require("path");
const saltRounds = 10;
const bcrypt = require('bcrypt');

const {
    check,
    validationResult
} = require('express-validator');

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1000000
    }
})

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




// router.post('/register', [
//         check('name', 'Name Must Not Be Eempty').exists().notEmpty().trim().isLength({
//             min: 2
//         }).escape(),
//         check('phone', 'Phone Number Must Not Be Empty.').exists().notEmpty().trim().escape(),
//         check('email', 'Invalid email.').exists().notEmpty().trim().isEmail().normalizeEmail().escape(),
//         check('password', 'Invalid password: Minimum 6 characters required').exists().notEmpty().trim().isLength({
//             min: 6
//         }).escape()
//     ],
//     upload.single('image'), (req, res, next) => {

//         let db = req.app.locals.db;
//         let loginToken = req.cookies.token;
//         let errors = validationResult(req);
//         let userInputObj = {
//             email: req.body.email
//         };

//         (async () => {

//             let emailCount = await new Promise(function (resolve) {
//                 const stmtCheckEmail = {
//                     text: "SELECT COUNT(id) FROM users WHERE email = $1",
//                     values: [req.body.email]
//                 }
//                 db.query(stmtCheckEmail, async function (err, result) {
//                     if (err) throw err;
//                     let emailCount = await result.rows[0].count
//                     return resolve(emailCount)
//                 })
//             });

//             let checkUniqueness = await new Promise(function (resolve) {
//                 if (emailCount != 0) {
//                     res.json({
//                         isEmailUnique: 'no',
//                         msg: 'This email is already taken.',
//                         userInput: userInputObj
//                     });
//                 } else {
//                     return resolve(1);
//                 }
//             });

//             let bcryptPassword = await new Promise(async (resolve) => {
//                 let hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
//                 return resolve(hashedPwd);
//             });

//             let insertUser = await new Promise(function (resolve) {
//                 const stmt = {
//                     text: `insert into users (name, email, phone, password, image) values($1, $2, $3, $4, $5)`,
//                     values: [req.body.name, req.body.email, req.body.phone, bcryptPassword, req.file.path]
//                 }
//                 db.query(stmt, async function (err, result) {
//                     if (err) throw err;
//                     let user = await result.rows[0];
//                     return resolve(user)
//                 })
//             });

//             res.json({
//                 "status": 200,
//                 "message": "user create successfully"
//             })

//         })()
//     });

router.get('/logout', controller.logout);



module.exports = router;