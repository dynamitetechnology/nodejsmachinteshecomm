const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtKey = process.env.JWT_SECRET;
const jwtExpirySeconds = 300;

module.exports = {
    jwtExpirySeconds: jwtExpirySeconds,

    isLoggedIn: (req, res, next) => {
        const token = req.cookies.token;
        if (req.url !== '/logout') {
            if (token) {
               //return res.json({status:200,message:"Your Are Loggedin"})
               return res.render("./index.ejs");
            }
        }
        next();
    },

    sign: (username) => {
        return jwt.sign({
            username
        }, jwtKey, {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds
        })
    },

    authenticateToken: (req, res, next) => {
        console.log("data_header ==> ",req.headers)

        //const token = req.headers.token      // for postman
        const token = req.cookies.token  // for browser
        console.log('AUTH TOKEN',token)
        if (!token) {
             // return res.json({status:200,message:"login Required"})
             return res.render("./index.ejs");
        }

        let payload;
        try {
            payload = jwt.verify(token, jwtKey)
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                res.clearCookie('token');
                 // return res.json({status:200,message:"login Required"})
                 return res.render("./index.ejs");
            }
            //return res.status(400).end()
            return res.render("./index.ejs");
        }
        next();
    },





    refreshToken: (req, res, next) => {

        const token = req.cookies.token;

        if (!token) {
             // return res.json({status:200,message:"login Required"})
             return res.render("./index.ejs");
        }

        let payload;
        try {
            payload = jwt.verify(token, jwtKey)
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                res.clearCookie('token');
               // return res.json({status:200,message:"login Required"})
               return res.render("./index.ejs");
            }
           // return res.status(400).end()
           return res.render("./index.ejs");
        }

        const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
        if (payload.exp - nowUnixSeconds > 60) {
            next();
        } else {
            const newToken = jwt.sign({
                username: payload.username
            }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds,
            })

            res.cookie("token", newToken, {
                maxAge: jwtExpirySeconds * 1000
            })
            next();
        }
    }
}