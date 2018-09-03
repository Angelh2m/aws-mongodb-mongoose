const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    info: {
        firstName: { type: String, required: true },
        lastName: { type: String, },
        phoneNumber: { type: String, },
        address: { type: String, },
        city: { type: String, },
        state: { type: String, },
        email: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String },
        googleId: { type: String },
        date: { type: Date, default: Date.now },
    },
    medical: [],
    payments: [],
    appointments: [],
    security: {
        token: { type: String, },
    }
});

module.exports = {
    User: mongoose.model('users', UserSchema)
}