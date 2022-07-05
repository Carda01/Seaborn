const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const fs = require('fs');
const handlebars = require("handlebars");

const models = require('../db/db');

const _email = process.env.EMAIL;
const pw = process.env.PASSWORD;

const smtpTransport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secureConnection: false,
    port:587,
    tls: {
        ciphers: 'SSLv3'
    },
    auth:{
        user: _email,
        pass: pw
    }
});


const emailTemplateSource1 = fs.readFileSync(path.join(__dirname, "/templates/forgot-password.hbs"), "utf8");
const templateForget = handlebars.compile(emailTemplateSource1);
const emailTemplateSource2 = fs.readFileSync(path.join(__dirname, "/templates/reset-password.hbs"), "utf8");
const templateReset = handlebars.compile(emailTemplateSource2);


smtpTransport.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Nodemailer is ready to send messages");
    }
});

const router = express.Router();

router.post('/forgot-password', asyncMiddleware(async (req, res, next) => {
    const {email} = req.body;
    const user = await models.user.findOne({
        where: {
            Email: email
        }
    });
    if (!user) {
        res.status(400).json({'message': 'invalid email'});
        return;
    }
    // create user token
    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');
    // update user reset password token and exp

    await user.update({resetToken: token, resetTokenExp: Date.now() + 600000});

    // send user password reset email
    const htmlToSend = templateForget( {
        url: `http://localhost:${process.env.PORT || 3000}/reset-password.html?token=${token}`,
        name: user.Username
    });

    const data = {
        to: user.Email,
        from: _email,
        subject: 'Seaborne Password Reset',
        html: htmlToSend
    };
    await smtpTransport.sendMail(data, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.status(200).json({message: 'An email has been sent to your email. Password reset link is only valid for 10 minutes.'});
}));

router.post('/reset-password', asyncMiddleware(async (req, res, next) => {
    const user = await models.user.findOne({
        where: {
            resetToken: req.body.token
            // resetTokenExp: {$gt: Date.now()}
        }
    });
    if (!user) {
        res.status(400).json({'message': 'invalid token'});
        return;
    }
    // ensure provided password matches verified password
    if (req.body.password !== req.body.verifiedPassword) {
        res.status(400).json({'message': 'passwords do not match'});
        return;
    }
    // update user model
    user.update({Encrypted_password: req.body.password, resetToken: null, resetTokenExp: null});
    // send user password update email
    const htmlToSend2 = templateReset( {
        name: user.Username
    });
    const data = {
        to: user.Email,
        from: _email,
        template: 'reset-password',
        subject: 'Seaborne Password Reset Confirmation',
        html: htmlToSend2
    };
    await smtpTransport.sendMail(data);
    res.status(200).json({message: 'password updated'});
}));
module.exports = router;