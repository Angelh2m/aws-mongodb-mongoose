const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    googleId: { type: String },
    info: {
        firstName: { type: String, },
        lastName: { type: String, },
        phoneNumber: { type: String, },
        address: { type: String, },
        city: { type: String, },
        state: { type: String, },
        avatar: { type: String },
        date: { type: Date, default: Date.now },
    },
    security: {
        token: { type: String },
    },
    medical: [],
    payments: [
        {
            name: { type: String },
            expires: { type: String },
            date: { type: Date, default: Date.now },
            paid: { type: Boolean, default: false },
            membership: { type: String },
            amount: { type: String }
        },
    ],
    questions: [
        {
            date: { type: Date, default: Date.now },
            subject: { type: String },
            content: { type: String },
            answered: { type: Boolean, default: false },
            doctosAnswer: {
                answer: { type: String, default: '' },
                specialty: { type: String, default: '' },
                city: { type: String, default: '' },
                date: { type: String, default: Date.now }
            },
            comments: [{
                user: String,
                comment: String,
                date: { type: String, default: Date },
            }],
        }
    ],
    appointments: [{
        date: { type: Date, default: Date.now },
        surgery: { type: String, default: '' },
        doctor: { type: String, default: '' },
        specialty: { type: String, default: '' },
        address: { type: String, default: '' },
        confirmed: { type: Boolean, default: false },
    }],

});

module.exports = {
    User: mongoose.model('users', UserSchema)
}