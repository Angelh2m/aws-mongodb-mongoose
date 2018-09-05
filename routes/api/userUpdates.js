const express = require('express');
const router = express.Router();

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { keys } = require('../../keys'); //JWT KEY
const { User } = require('../../schemas/User');


// @route   GET api/users/current
// @desc    Return current user // Protected route using token
// @access  Private
router.put('/user', passport.authenticate('jwt', { session: false }),
    (req, res) => {

        let email = req.user.email;
        const newUserData = JSON.parse(req.body.updateUserData);
        const cleanUserObject = (obj) => {
            Object.keys(obj).forEach(el => (!obj[el] && obj[el] !== undefined) && delete obj[el]);
            return obj
        }

        const cleanData = cleanUserObject(newUserData);

        User.findOne({ email })
            .then((user) => {
                console.log(user);

                user.info = {
                    ...user.info,
                    ...cleanData
                }

                user.save().then(newUpdate => {
                    return res.json({
                        ok: true,
                        user: newUpdate
                    });

                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
    }

);


module.exports = router;