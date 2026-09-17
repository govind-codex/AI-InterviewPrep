const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_-]+$/,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
    },

    password: {
        type: String,
        required: true,
    }
});
const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;
