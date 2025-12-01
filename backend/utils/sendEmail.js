const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a "transporter" (the service that sends the email)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Using Gmail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `LegalEase Support <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email', error);
  }
};

module.exports = sendEmail;