"use strict";
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth:{
        user: process.env.HOTMAIL_USER,
        pass: process.env.HOTMAIL_PASSWORD
    }
});

module.exports = transporter;

