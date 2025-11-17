const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.headers['user-role'];
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { checkRole };