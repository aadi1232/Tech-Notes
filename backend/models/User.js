const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true // Corrected 'require' to 'required'
    },

    password: {
        type: String,
        required: true // Corrected 'require' to 'required'
    },

    roles: [{
        type: String,
        default: "Employee"
    }],

    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('User', UserSchema);

