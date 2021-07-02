const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {

    sendEmail: (from, to, subject, message) => {
        let transporter = nodemailer.createTransport({
            host: 'mail.thelastyogi.com',
            port: 465,
            secure: true,
            auth: {
                user: 'test@thelastyogi.com',
                pass: 'mVO*S1Kl?DU]'
            }
        });

        let mailOptions = {
            from: `"Cark Geek" <${from}>`,
            to: `${to}`,
            subject: `${subject}`,
            html: `${message}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) throw error;
            console.log('Email sent successfully.', info)
        });
    }

}