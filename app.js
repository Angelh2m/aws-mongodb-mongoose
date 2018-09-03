const serverless = require('serverless-http');
const express = require('express')
const app = express();
const cors = require('cors');

const { keys } = require('./keys');
const passport = require('passport');
const mongoose = require('mongoose');
const users = require('./routes/api/usersRegistration')



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

// @Routes 
//  Register a new user => /register
//  Login a user => /login
//  Get user profile  => /profile


module.exports.handler = serverless(app);

const port = process.env.PORT || 6000;

app.listen(port, () => {
    console.log('Server Running');
});