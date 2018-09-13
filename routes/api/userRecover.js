const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const { keys } = require('../../keys');
const { User } = require('../../schemas/User');

const nodemailer = require('nodemailer');

/* *
*  Node Mailer config
*/
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: keys.googleEmailAccount,
        pass: keys.googlePasswordAccount
    }
});


// @route   POST api/forgot
// @desc    Hit this route and EMAIL the TOKEN to the user's email
// @headers email
// @access  Private
router.post('/forgot-password', (req, res) => {
    const email = req.body.email ? req.body.email.toLowerCase().trim() : '';

    // If the user exist we will send the password
    User.findOne({ email })
        .then((user) => {
            console.log(user);

            if (!user) {
                return res.status(404).json({ email: 'User not found' });
            }

            // Create jwt payload
            const payload = { user: user.email };

            // Sign a new token 
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 1800 }, (err, token) => {

                // Set the token in user's account for security 
                User.findOneAndUpdate(user.id, { "security.token": token }, { upsert: true })
                    .then(userUpdated => {
                        /* *
                        *  EMAIL A TOKEN FOR THE NEXT 30 MINUTES
                        */
                        let mailOptions = {
                            from: '"Fred Foo 👻" <foo@example.com>', // sender address
                            to: `${userUpdated.email}`, // list of receivers
                            subject: 'Hello 👻 ✔', // Subject line
                            text: 'Recover your password', // plain text body
                            html: `<b>Password link</b> <h2>${token}</h2>  <a href="http://localhost:6000/api/change?=${token}"> Recover </a>` // html body
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {

                            if (error) { return console.log(error) }

                            return res.json({
                                success: true,
                                message: 'We have emailed you the link to set a new password',
                                token: `Bearer ${token}`,

                            });
                        });
                    }).catch(err => err)
            });

        }).catch(err => err)
});

// router.get('/new-password/:token', (req, res) => {
//     const token = req.params.token;
//     var decoded = jwtDecode(token);
//     console.log(decoded);
//     // const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
//     const email = req.body.password.user;
// })

// @route   POST api/new-password
// @desc    Return current user // Protected route using token
// @send    token, email, password
// @access  Private
router.post('/new-password', (req, res) => {
    const token = req.body.token;
    const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
    const newPassword = req.body.password;

    if (!newPassword) {
        return res.json({ ok: false })
    }

    User.findOne({ email }).then((user) => {

        if (user.security.token !== token) {
            return res.json({
                success: false,
                message: ':) Good try!'
            })
        }

        bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(newPassword, salt, (err, hash) => {
                if (err) throw err;
                let password = hash;

                User.findOneAndUpdate(user.id, { 'password': password, "security.token": '' })
                    .then(response => {
                        return res.json({
                            success: true,
                            hash,
                        })
                    }).catch(err => err)
            });
        });


    })

})

module.exports = router;
