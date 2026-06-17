const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/authController");
const {
  verifyToken, authorizeRoles
} = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfile);
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