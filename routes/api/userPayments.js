const express = require('express');
const router = express.Router();

// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const passport = require('passport');
const { User } = require('../../schemas/User');
// Stripe
const { keys } = require('../../keys');
const stripe = require("stripe")(keys.stripeKey);

router.post('/payments', passport.authenticate('jwt', { session: false }),
    (req, res) => {

        const token = req.body.stripeToken;
        const email = req.body.email
        const membership = req.body.membership

        // console.log(JSON.parse(membership).total);
        // name: { type: String },
        // expires: { type: String },
        // date: { type: Date, default: Date.now },
        // paid: { type: Boolean, default: false },
        // plan: { type: Boolean, default: false },
        // amount: { type: String }

        stripe.charges.create({
            amount: JSON.parse(membership).total * 100,
            currency: "usd",
            source: token, // obtained with Stripe.js
            description: `Charge for ${email}`,
            metadata: {
                accepted_terms_and_conditions: true,
            },
        })
            .then(payment => {

                const charge = {
                    amount: payment.amount,
                    paid: payment.paid,
                    membership: membership,
                }

                User.findOne({ _id: req.user.id })
                    .then((user) => {

                        user.payments.unshift({ ...charge })

                        user.save().then(newUpdate => {
                            return res.json({
                                ok: true,
                                user: newUpdate,
                                payment
                            });

                        }).catch(err => console.log(err))
                    }).catch(err => console.log(err))
            })
            .catch(err => res.json({ err }))
    }
);


module.exports = router;