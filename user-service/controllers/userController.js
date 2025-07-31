const User = require("../models/User");
const CustomError = require("../utils/customError");

// GET /profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(new CustomError("Failed to fetch profile", 500));
  }
};

// PUT /profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    
    if (!name && !bio) {
      return next(new CustomError("At least one field (name or bio) is required", 400));
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio },
      { new: true, runValidators: true }
    ).select("-password -__v");
    
    if (!updated) {
      return next(new CustomError("User not found", 404));
    }
    
    res.json({ success: true, data: updated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new CustomError(err.message, 400));
    }
    next(new CustomError("Failed to update profile", 500));
  }
};

// DELETE /profile
const deleteProfile = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.user.id);
    if (!deleted) {
      return next(new CustomError("User not found", 404));
    }
    res.json({ success: true, message: "Profile deleted successfully" });
  } catch (err) {
    next(new CustomError("Failed to delete profile", 500));
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile
};
