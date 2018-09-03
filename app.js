const serverless = require('serverless-http');
const express = require('express')
const app = express();
const cors = require('cors');

const { keys } = require('./keys');
const passport = require('passport');
const mongoose = require('mongoose');
const users = require('./routes/api/usersRegistration')
const recover = require('./routes/api/userRecover')

/* *
 *  Set up cors
 */
app.use(cors({ origin: true, credentials: true }));

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

// @Routes 
//  Register a new user => api/register
//  Login a user => api/login
//  Get user profile  => api/profile


module.exports.handler = serverless(app);

const port = process.env.PORT || 6000;

app.listen(port, () => {
    console.log('Server Running');
});