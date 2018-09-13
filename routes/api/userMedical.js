const express = require('express');
const router = express.Router();

const passport = require('passport');
const { User } = require('../../schemas/User');


// @route   GET api/users/current
// @desc    Return current user // Protected route using token
// @access  Private
router.post('/medical-exam', passport.authenticate('jwt', { session: false }),
    (req, res) => {

        let exam = req.body.medical;
        if (exam) {
            let pased = JSON.parse(exam);
            User.findOne({ _id: req.user.id })
                .then((user) => {
                    user.medical.push(pased)
                    user.save().then(newUpdate => {

                        return res.json({
                            ok: true,
                            user: newUpdate
                        });
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
        }
    });





module.exports = router;