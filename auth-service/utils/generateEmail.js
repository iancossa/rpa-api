const generateEmailToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_SECRET, // Create in .env
    { expiresIn: '30m' }
  );
};

