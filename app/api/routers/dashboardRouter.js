const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');
const { check, validationResult} = require('express-validator');
const multer = require("multer");
const path = require("path");

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

router.get('/dashboard', controller.getDashboard);

router.get('/addproduct', controller.addproduct)

router.post('/addproduct', [
        check('product_name', 'Name Must Not Be Eempty').exists().notEmpty().trim().escape(),
        check('product_price', 'Price Must Not Be Empty.').exists().notEmpty().trim().escape(),
        check('product_stock', 'Stock Must Not Be Empty.').exists().notEmpty().trim().isEmail().normalizeEmail().escape(),
        check('product_disc', 'Desc Must Not Be Empty.').exists().notEmpty().trim().isLength({
            min: 6
        }).escape()
    ],
    upload.single('product_image'), (req, res, next) => {

        let db = req.app.locals.db;
        let loginToken = req.cookies.token;
        let errors = validationResult(req);
  

        (async () => {
            let addnewProducts = await new Promise(function (resolve) {
                const stmt = {
                    text: `insert into products (product_name, product_price, stock, product_description, product_image) values($1, $2, $3, $4, $5)`,
                    values: [req.body.product_name, req.body.product_price, req.body.product_stock, req.body.product_disc, req.file.path]
                }
                db.query(stmt, async function (err, result) {
                    if (err) throw err;
                    let user = await result.rows[0];
                    return resolve(user)
                })
            });

            res.redirect("/dashboard")
        })()
    });



    router.post('/updateproduct', [
        check('product_name', 'Name Must Not Be Eempty').exists().notEmpty().trim().escape(),
        check('product_price', 'Price Must Not Be Empty.').exists().notEmpty().trim().escape(),
        check('product_stock', 'Stock Must Not Be Empty.').exists().notEmpty().trim().isEmail().normalizeEmail().escape(),
        check('product_disc', 'Desc Must Not Be Empty.').exists().notEmpty().trim().isLength({
            min: 6
        }).escape()
    ],
    upload.single('product_image'), (req, res, next) => {

        let db = req.app.locals.db;
        let loginToken = req.cookies.token;
        let errors = validationResult(req);
  

        (async () => {
            let addnewProducts = await new Promise(function (resolve) {
                const stmt = {
                    text: `update products set product_name = $1, product_price = $2, stock = $3, product_description = $4, product_image = $5 where id = $6`,
                    values: [req.body.product_name, req.body.product_price, req.body.product_stock, req.body.product_disc, req.file.path,req.body.product_id]
                }
                db.query(stmt, async function (err, result) {
                    if (err) throw err;
                    let user = await result.rows[0];
                    return resolve(user)
                })
            });

            res.redirect("/dashboard")
        })()
    });

router.post('/deleteproduct',controller.deleteproduct)

router.post('/getproduct',controller.getproduct)

module.exports = router;
