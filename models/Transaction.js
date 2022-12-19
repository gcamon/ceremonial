const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
        },
        accNum: {
            type: String,
        },
        name: {
            type: String,
        },
        amount: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        refunded: {
            type: Boolean,
            default: false
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            default: ""
        } 
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction",TransactionSchema)