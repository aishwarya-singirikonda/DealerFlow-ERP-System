const express = require("express");
const router = express.Router();

const {
  addDealer,
  getAllDealers,
  getDealerById,
  updateDealer,
  deleteDealer
} = require("../controllers/dealerController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  addDealer
);

router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "staff"),
  getAllDealers
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "staff"),
  getDealerById
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateDealer
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteDealer
);

module.exports = router;