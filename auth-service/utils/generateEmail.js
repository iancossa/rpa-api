// ✅ generateEmail.js
const jwt = require('jsonwebtoken');

function generateEmailToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.EMAIL_SECRET, {
    expiresIn: '1h'
  });
}

module.exports = generateEmailToken;

