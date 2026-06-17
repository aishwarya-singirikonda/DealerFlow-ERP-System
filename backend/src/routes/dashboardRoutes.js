const express = require("express");
const router = express.Router();

const {
  getDashboardSummary
} = require("../controllers/dashboardController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
  "/summary",
  verifyToken,
  authorizeRoles("admin"),
  getDashboardSummary
);

module.exports = router;