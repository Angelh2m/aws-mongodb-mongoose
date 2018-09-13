const express = require('express');
const router = express.Router();

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { keys } = require('../../keys'); //JWT KEY
const { User } = require('../../schemas/User');


// @route   POST api/users/register
// @desc    Register route
// @access  Public
router.post('/register', (req, res) => {
    const email = req.body.email ? req.body.email.toLowerCase().trim() : '';

    if (email === '') { return res.status(400).json({ ok: false, message: 'No valid email' }) }

    User.findOne({ email })
        .then((user) => {

            if (user) {
                var errors = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                // Get the gravatar
                const avatar = gravatar.url(email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                });

                const newUser = new User({
                    email,
                    password: req.body.password,
                    info: {
                        firstName: req.body.name,
                        avatar,
                    }
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {

                        if (err) { return res.json(err) }

                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => res.json(user))
                            .catch((err) => console.log(err));
                    });
                });
            }
        });
});


// @route   GET api/users/login
// @desc    Login the user // Provide token to user
// @access  Public
router.post('/login', (req, res) => {

    const password = req.body.password;
    const email = req.body.email ? req.body.email.toLowerCase().trim() : '';

    User.findOne({ email })
        .then((user) => {

            if (!user) {
                return res.status(404).json({
                    email: 'User not found'
                });
            }

            // Check if the password is correct
            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        // User match
                        const payload = {
                            id: user.id,
                            name: user.info.name,
                            avatar: user.info.avatar
                        }; // Create jwt payload

                        // Sign the token
                        jwt.sign(payload, keys.secretOrKey, {
                            expiresIn: 21600,
                        }, (err, token) => {
                            return res.json({
                                success: true,
                                token: `Bearer ${token}`
                            })
                        });
                    }

                    if (!isMatch) {
                        return res.status(400).json({
                            password: 'Incorrect password'
                        });
                    }

                }).catch(err => err)
        }).catch(err => err)
});


// @route   GET api/users/current
// @desc    Return current user // Protected route using token
// @access  Private
router.get('/profile', passport.authenticate('jwt', {
    session: false
}),
    (req, res) => {
        req.user.password = ":) Encrypted!";
        res.json({
            user: req.user
        })
    }
);


module.exports = router;