const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
const User = mongoose.model('users');
const { keys } = require('../keys');

// Compare if the token is valid
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;


module.exports = (passport) => {


    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('PAYLOAD', jwt_payload.id);

        User.findOne({ _id: jwt_payload.id }, (err, user) => {
            console.log(user);

            if (err) {
                return done(err, false);
            }
            if (user) {
                // If the user has been found
                // Access user from the request
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));

}