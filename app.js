const serverless = require('serverless-http');
const awsServerlessExpress = require('aws-serverless-express')
const express = require('express')
const app = express();
const server = awsServerlessExpress.createServer(app)
const cors = require('cors');

const { keys } = require('./keys');
const passport = require('passport');
const mongoose = require('mongoose');
// Routes
const users = require('./routes/api/usersRegistration')
const recover = require('./routes/api/userRecover')
const update = require('./routes/api/userUpdates')
const questions = require('./routes/api/userQuestions')
const payments = require('./routes/api/userPayments')
const userMedical = require('./routes/api/userMedical')
const makeAppointment = require('./routes/api/createAppointment')
// const userUploads = require('./routes/api/userImageUpload')

/* *
 *  Set up cors
 */
app.use(
    cors({
        origin: "*",
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    }));
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "PUT, GET, POST, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

/* *
 *  Use the express.json instead of bodyparser
 */
app.use(express.urlencoded({ extended: true }));

/* *
 *  Connect to MongoDB
 */
mongoose.connect(keys.mongoURL, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => err);

/* *
 *  PASSPORT STRATEGIES
 */
app.use(passport.initialize());
require('./config/passport')(passport);
require('./config/passport-google')(passport);


app.use('/api', users);
app.use('/api', recover);
app.use('/api', update);
app.use('/api', questions);
app.use('/api', payments);
app.use('/api', userMedical);
app.use('/api', makeAppointment);
// app.use('/api', userUploads);

// @Routes 
//  Register a new user => api/register
//  Login a user => api/login
//  Get user profile  => api/profile


// exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)

// module.exports.handler = serverless(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server Running');
});