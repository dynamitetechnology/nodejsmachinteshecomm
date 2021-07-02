const bcrypt = require('bcrypt');
const {
    check,
    validationResult
} = require('express-validator');
const saltRounds = 10;

const jwtAuth = require('../utils/auth');




module.exports = {


    getuserLogin:(req,res,next)=>{
        (async () => {

            res.render("index.ejs")

        })();
    },



    getRegPage: (req,res,next)=>{ (async () => {

        res.render("reguser.ejs")

    })();},

    dashboard:(req, res, next) => {
        (async () => {
            let db = req.app.locals.db;

            console.log(res.locals)
            const token = jwtAuth.sign(res.locals.username)

            res.cookie("token", token, {
                maxAge: jwtAuth.jwtExpirySeconds * 1000
            })


            res.render("dashboard.ejs")
    
        })();
    },

    userLogin: (req, res, next) => {
        let db = req.app.locals.db;
        console.log("body ->", req.body)
        let loginToken = req.cookies.token;
        (async () => {

            let userData = await new Promise(resolve => {
                const userStmt = {
                    text: `select name, email, mobile,password FROM users WHERE email = $1 or mobile = $1`,
                    values: [req.body.username]
                }
                db.query(userStmt, async (err, obj) => {
                    if (err) throw err;
                    let result = await obj.rows;
                    if (result.length == 0) {
                        return res.json({
                            isLoggedIn: false,
                            msg: "Username or password is invalid",
                            username: req.body.username
                        })
                    } else {
                        return resolve(result[0]);
                    }
                })
            })

            let verifyPass = await new Promise(resolve => {
                bcrypt.compare(req.body.password, userData.password, (err, result) => {
                    // if (err) throw err;

                    if (result) {
                        let username = req.body.username;
                        const token = jwtAuth.sign(username)

                        res.cookie("token", token, {
                            maxAge: jwtAuth.jwtExpirySeconds * 1000
                        })

                        console.log(res.locals.username)
                       return  res.redirect('/dashboard');
                        res.json({
                            status: "200",
                            message: "success",
                            auth: true,
                            token: token
                        })

                    } else {
                        return res.json({
                            msg: "Username or password is invalid",
                            isLoggedIn: false
                        })
                    }

                });

            })


        })()

    },

    register: (req, res, next) => {
        let db = req.app.locals.db;
        let loginToken = req.cookies.token;
        let errors = validationResult(req);
            let userInputObj = {
                email: req.body.email
            };

            (async () => {

                let emailCount = await new Promise(function (resolve) {
                    const stmtCheckEmail = {
                        text: "SELECT COUNT(id) FROM users WHERE email = $1 or mobile  = $1",
                        values: [req.body.email]
                    }
                    db.query(stmtCheckEmail, async function (err, result) {
                        if (err) throw err;
                        let emailCount = await result.rows[0].count
                        return resolve(emailCount)
                    })
                });

                let checkUniqueness = await new Promise(function (resolve) {
                    if (emailCount != 0) {
                        res.json({
                            isEmailUnique: 'no',
                            msg: 'This email is already taken.',
                            userInput: userInputObj
                        });
                    } else {
                        return resolve(1);
                    }
                });

                let bcryptPassword = await new Promise(async (resolve) => {
                    let hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
                    return resolve(hashedPwd);
                });

                console.log("EMAIL",req.body.email)

                let insertUser = await new Promise(function (resolve) {
                    const stmt = {
                        text: `insert into users (name, email, mobile, password) values($1, $2, $3, $4)`,
                        values: [req.body.name, req.body.email, req.body.mobile, bcryptPassword]
                    }
                    db.query(stmt, async function (err, result) {
                        if (err) throw err;
                        let user = await result.rows[0];
                        return resolve(user)
                    })
                });

               //res.json({"status":200,"message":"user create successfully"})
               res.render("index.ejs",{"status":200,"message":"user create successfully"})

            })()
    },


  

    logout: (req, res, next) => {
        res.clearCookie('token');
        res.json({
            status: "200",
            message: "Successfully logout"
        })
    }
}