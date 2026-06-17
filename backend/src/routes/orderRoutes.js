const express = require("express");
const router = express.Router();

const {
  createOrder,
  approveOrder,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

router.post(
  "/",
  verifyToken,
  createOrder
);

router.get(
  "/",
  verifyToken,
  getAllOrders
);

router.put(
  "/approve/:id",
  verifyToken,
  authorizeRoles("admin"),
  approveOrder
);

router.put(
  "/:id/status",
  verifyToken,
  authorizeRoles("admin"),
  updateOrderStatus
);

module.exports = router;