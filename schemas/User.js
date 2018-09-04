const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    email: { type: String, required: true },
    info: {
        firstName: { type: String, required: true },
        lastName: { type: String, },
        phoneNumber: { type: String, },
        address: { type: String, },
        city: { type: String, },
        state: { type: String, },
        password: { type: String, required: true },
        avatar: { type: String },
        googleId: { type: String },
        date: { type: Date, default: Date.now },
    },
    security: {
        token: { type: String },
    },
    medical: [],
    payments: [],
    appointments: [],

});

module.exports = {
    User: mongoose.model('users', UserSchema)
}