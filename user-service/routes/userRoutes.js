const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteProfile
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

// Protected Routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.delete("/profile", verifyToken, deleteProfile);

module.exports = router;
