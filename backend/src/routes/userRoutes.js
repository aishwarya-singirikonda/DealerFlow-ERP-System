const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
  deleteUser
} = require("../controllers/userController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");


// GET ALL USERS (ADMIN ONLY)
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  getAllUsers
);


// UPDATE ROLE
router.put(
  "/:id/role",
  verifyToken,
  authorizeRoles("admin"),
  updateUserRole
);


// DELETE USER
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;
