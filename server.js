const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const bodyParser = require('body-parser');
const port = 3000;
const dbConfig = require('./config/db');

const {isLoggedIn, authenticateToken, refreshToken} = require('./app/api/utils/auth');
const userRouter = require('./app/api/routers/userRouter');
const dashboardRouter = require('./app/api/routers/dashboardRouter');

let client = redis.createClient(6379, process.env.REDIS_IP);


app.use(bodyParser.json({ limit: "5mb" }));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());


app.use('/profile', express.static('upload/images'));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(cookieParser('your-secret-dontknow'));


// (async () => {
//     app.locals.db = await dbConfig.pgPool.connect();
//     app.listen(port, function () {
//         console.log("Server started at port ", port);
//     })
// })()



app.use('/user', isLoggedIn,userRouter);
app.use('/', authenticateToken, refreshToken, dashboardRouter)

//pp.use('/', authenticateToken, dashboardRouter)

;(async function () {
	client.AUTH(process.env.REDIS_PASS, async function (err, result) {
		if (err) {
			console.log('redis connection errr => ', err);
		} else {
			console.log('redis connection reply => ', result);
		}
	})
	const pgClient = await dbConfig.pgPool.connect();
	app.locals.db = pgClient;
	app.locals.redisdb = client;
	app.listen(port, function () {
		console.log('server started at ', port);
	})
})();
