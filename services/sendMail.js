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

const sendCrimeDetailsEmail = async (crimeDetails) => {
    const {
        assignedCrimeNumber,
        aadharNumber,
        email,
        crimeType,
        firstName,
        lastName,
        policeStation,
        description,
        crimeDate,
    } = crimeDetails;

    // Create transporter for nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email content
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Crime Record Notification - Crime Number: ${assignedCrimeNumber}`,
        html: `
            <h2>Crime Record Details</h2>
            <p>Dear ${firstName} ${lastName},</p>
            <p>The following details have been recorded for a crime associated with your Aadhar Number.</p>
            <ul>
                <li><strong>Crime Number:</strong> ${aadharNumber}</li>
                <li><strong>Crime Number:</strong> ${assignedCrimeNumber}</li>
                <li><strong>Crime Type:</strong> ${crimeType}</li>
                <li><strong>Police Station:</strong> ${policeStation}</li>
                <li><strong>Crime Date:</strong> ${new Date(crimeDate).toLocaleDateString()}</li>
                <li><strong>Description:</strong> ${description}</li>
            </ul>
            <p>Please contact the relevant police station for any further information.</p>
            <p>Regards,</p>
            <p>Uttar Pradesh Police Department</p>
        `,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send crime details email');
    }
};


module.exports = {
  sendVerificationEmail,
  sendCrimeDetailsEmail
};
