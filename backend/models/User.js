const mongoose = require('mongoose')

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,

    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,

    },
    date: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    isApproved: {
        type: Boolean,
        required: true
    },
    profilePic: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false
    }

});
module.exports = mongoose.model('User', UserSchema)