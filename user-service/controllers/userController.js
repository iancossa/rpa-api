const User = require("../models/User");

// GET /profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// PUT /profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// DELETE /profile (optional)
const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete profile" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile
};
