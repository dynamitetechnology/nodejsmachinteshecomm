const jwt = require('jsonwebtoken');
const {
    check,
    validationResult
} = require('express-validator');

module.exports = {

    getDashboard: (req, res, next) => {
        
        ;(async () => {
            let db = req.app.locals.db;
            const token = req.cookies.token;
            let errors = validationResult(req);

            let payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log('payload-------->', payload)


            let productList = await new Promise(function (resolve) {
                const stmt = {
                    text: `SELECT id, product_name, product_price, stock, product_description, product_image FROM products order by id desc`,
                    values: []
                }
                db.query(stmt, async function (err, result) {
                    if (err) throw err;
                    let user = await result.rows;
                    return resolve(user)
                })
            });
console.log(productList)
            res.render("dashboard.ejs",{productList:productList})
        })();
    },

    addproduct:(req, res, next)=>{
        ;(async () => {
            let db = req.app.locals.db;
            const token = req.cookies.token;
            let errors = validationResult(req);
            let payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log('payload-------->', payload)
            res.render("addproducts.ejs")
        })();
    },

    deleteproduct: (req,res,next) => {
        ;(async () => {
            let db = req.app.locals.db;
            const token = req.cookies.token;
            let errors = validationResult(req);
console.log("Hello Print")
            let productList = await new Promise(function (resolve) {
                const stmt = {
                    text: `delete FROM products where id = $1`,
                    values: [req.body.prid]
                }
                db.query(stmt, async function (err, result) {
                    if (err) throw err;
                    let user = await result.rows[0];
                    return resolve(user)
                })
            });
        console.log(productList)
            res.json({"status":"200"});

        })();
    }

    
}