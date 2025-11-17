
const jwt = require('jsonwebtoken');

const generateEmailToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.EMAIL_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = generateEmailToken;
