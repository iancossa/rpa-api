const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});


async function sendVerificationEmail(user, token) {
  const url = `http://localhost:5000/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Auth Service" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Verify your email',
     html: `
    <p>Hello,</p>
    <p>Thank you for signing up. Please confirm your email address by clicking the link below:</p>
    <p><a href="${url}">Verify Email</a></p>
    <p>If you did not create this account, please ignore this message.</p>
    <p>– The Auth Service Team</p>
  `,
  });
}

module.exports = sendVerificationEmail;


/**
 * @swagger
 * /verify-email:
 *   get:
 *     summary: Verify a user's email using a token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
