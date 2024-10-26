const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendVerificationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email',
    text: `Please verify your email by clicking on the link: ${process.env.HOST}/auth/verify/${token}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log('Email sent: ' + info.response);
  });
};

module.exports = {
  sendVerificationEmail,
};
