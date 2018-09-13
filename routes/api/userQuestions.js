const express = require('express');
const router = express.Router();

// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const passport = require('passport');

// const { keys } = require('../../keys'); 
const { User } = require('../../schemas/User');


// @route   GET api/questions'
// @desc    MAKE A NEW QUESTION
// @access  Private
router.post('/questions', passport.authenticate('jwt', { session: false }),
    (req, res) => {

        let subject = req.body.subject;
        let content = req.body.content;
        const date = Date(Date.now());

        User.findOne({ _id: req.user.id })
            .then((user) => {

                const userQuestion = {
                    subject,
                    content,
                    ...date
                }
                user.questions.unshift(userQuestion)

                user.save().then(newUpdate => {
                    return res.json({
                        ok: true,
                        user: newUpdate
                    });

                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
    }
);


// @route   GET api/questions'
// @desc    MAKE A NEW QUESTION
// @access  TEST PURPOSES!!!!!!
router.put('/questions', passport.authenticate('jwt', { session: false }),
    (req, res) => {

        let question = req.body.question;
        let questionId = req.body.id;

        User.update({ 'questions._id': questionId },
            {
                '$set': {
                    'questions.$.content': question,
                }
            })
            .then((user) => {
                return res.json({
                    ok: true,
                    message: 'The question has been updated',
                });
            }).catch(err => console.log(err))
    }
);


// @route   GET api/questions'
// @desc    RESPOND THE QUESTION USER ONLY
// @access  PRIVATE

router.put('/respond-question', passport.authenticate('jwt', { session: false }),
    (req, res) => {

        let comment = req.body.comment;
        let questionId = req.body.id;
        const user = req.user.info.firstName;
        console.log(comment, questionId);


        const answerObj = {
            user,
            comment,
        };

        User.findOne({ _id: req.user.id })
            .then((user) => {

                user.questions.map((el, i) => {
                    if (user.questions[i]._id == questionId) {
                        user.questions[i].comments.push(answerObj);
                    }
                })

                user.save();

                return res.json({
                    ok: true,
                    message: 'Your answer has been succesfully recorded!',
                    answerObj
                });
            }).catch(err => console.log(err))

    }
);


router.delete('/questions', passport.authenticate('jwt', { session: false }),
    (req, res) => {

        let questionId = req.body.id;

        User.findByIdAndUpdate({ '_id': req.user.id },
            { $pull: { "questions": { _id: questionId } } },
            { safe: true, upsert: true }
        ).then(() => {
            return res.json({
                success: true,
                messae: 'The question has been deleted'
            });
        }).catch(err => err)
    }
);



module.exports = router;