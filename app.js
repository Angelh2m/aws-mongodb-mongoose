const serverless = require('serverless-http');
const express = require('express')
const app = express();
const cors = require('cors');

const { keys } = require('./keys');
const passport = require('passport');
const mongoose = require('mongoose');
// Routes
const users = require('./routes/api/usersRegistration')
const recover = require('./routes/api/userRecover')
const update = require('./routes/api/userUpdates')

/* *
 *  Set up cors
 */
app.use(cors({ origin: true, credentials: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

// @Routes 
//  Register a new user => api/register
//  Login a user => api/login
//  Get user profile  => api/profile


module.exports.handler = serverless(app);

const port = process.env.PORT || 6000;

app.listen(port, () => {
    console.log('Server Running');
});