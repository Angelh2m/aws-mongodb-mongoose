const express = require('express');
const router = express.Router();
// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const passport = require('passport');
// const { keys } = require('../../keys'); 
const { User } = require('../../schemas/User');


// @route   GET api/users/current
// @desc    Return current user // Protected route using token
// @access  Private
router.put('/make-appointment', passport.authenticate('jwt', { session: false }),
    (req, res) => {

        let payload = {
            date: req.body.date,
            surgery: req.body.surgery,
            doctor: req.body.doctor,
            specialty: req.body.specialty,
            address: req.body.address,
            confirmed: req.body.confirmed
        }

        console.log(payload);

        console.log('----------------------------------');

        User.findOne({ _id: req.user.id })
            .then((user) => {

                user.appointments.push(payload);
                console.log(user.appointments);

                user.save().then(newUpdate => {
                    return res.json({
                        ok: true,
                        user: newUpdate.appointments
                    });

                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
    }

);


module.exports = router;