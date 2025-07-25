const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"RPA Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification',
    html: `<p>Click <a href="${url}">here</a> to verify your email. Link expires in 30 minutes.</p>`,
  });
};

module.exports = sendVerificationEmail;
