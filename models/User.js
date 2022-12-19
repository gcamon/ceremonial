const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        regNum: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: ""
        },
        department: {
            type: String,
            default: ""
        },
        faculty: {
            type: String,
            default: ""
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        verifyToken: {
            type: String
        },
        isServiceWorthy: {
            type: Boolean,
            default: false
        },
        transactions: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Transaction'
        }],
        token: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User",UserSchema)