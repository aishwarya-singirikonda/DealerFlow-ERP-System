const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} = require("../controllers/authController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");


// Register
router.post(
  "/register",
  registerUser
);


// Login
router.post(
  "/login",
  loginUser
);


// Get Profile
router.get(
  "/profile",
  verifyToken,
  getProfile
);


// Update Profile
router.put(
  "/profile",
  verifyToken,
  updateProfile
);


// Admin-only Route
router.get(
  "/admin-only",
  verifyToken,
  authorizeRoles("admin"),
  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Admin"
    });

  }
);


module.exports = router;
