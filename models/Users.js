const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, "Email Exist"]
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Users', UsersSchema)