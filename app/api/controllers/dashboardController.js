const jwt = require('jsonwebtoken');
const {
    check,
    validationResult
} = require('express-validator');

module.exports = {

    getDashboard: (req, res, next) => {
        ;
        (async () => {
            let db = req.app.locals.db;
            const token = req.cookies.token;
            let errors = validationResult(req);

            let payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log('payload-------->', payload)


            res.render("dashboard.ejs")
        })();
    },

    addproduct:(req, res, next)=>{
        ;
        (async () => {
            let db = req.app.locals.db;
            const token = req.cookies.token;
            let errors = validationResult(req);

            let payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log('payload-------->', payload)


            res.render("addproducts.ejs")
        })();
    },

    getuserdetail: (req, res, next) => {

        ;
        (async () => {
            let db = req.app.locals.db;
            const token = req.cookies.token;
            let errors = validationResult(req);

            let payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log('payload-------->', payload)

            if (req.body.email == payload.username) {
                let userinfo = await new Promise(function (resolve) {
                    const stmt = {
                        text: `select  name, email, phone, password, image from  users where email = $1`,
                        values: [req.body.email]
                    }
                    db.query(stmt, async function (err, result) {
                        if (err) throw err;
                        let user = await result.rows[0];
                        return resolve(user)
                    })
                });

                res.json({
                    status: 200,
                    message: "success",
                    userinfo: userinfo
                })
            } else {
                res.json({
                    status: 200,
                    message: "Invalid Token"
                })
            }
        })()
    },

    addpost: (req, res, next) => {

        ;
        (async () => {
            let db = req.app.locals.db;
            const token = req.cookies.token;
            let errors = validationResult(req);

            let payload = jwt.verify(token, process.env.JWT_SECRET)

            let userinfo = await new Promise(function (resolve) {
                const stmt = {
                    text: `insert into post_collection (title, description, createdby) values ($1, $2, $3)`,
                    values: [req.body.title, req.body.description, payload.username]
                }
                db.query(stmt, async function (err, result) {
                    if (err) throw err;
                    let user = await result.rows[0];
                    return resolve(user)
                })
            });

            res.json({
                status: 200,
                message: "successfully posted"
            })

        })()
    },


    userpostlist: (req, res, next) => {

        ;
        (async () => {
            let db = req.app.locals.db;
            const token = req.cookies.token;
            let errors = validationResult(req);

            let payload = jwt.verify(token, process.env.JWT_SECRET)

            let userpost = await new Promise(function (resolve) {
                const stmt = {
                    text: `select  title, description, createdby from post_collection where createdby = $1`,
                    values: [req.body.username]
                }
                db.query(stmt, async function (err, result) {
                    if (err) throw err;
                    let user = await result.rows;
                    return resolve(user)
                })
            });

            res.json({
                status: 200,
                message: "success",
                userpost: userpost
            })

        })()
    }
}