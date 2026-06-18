const express = require("express");

const router = express.Router();

const {
  addPayment,
  getAllPayments,
  markPaid
} = require("../controllers/paymentController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");


// Add Payment
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  addPayment
);


// Get All Payments
router.get(
  "/",
  verifyToken,
  authorizeRoles(
    "admin",
    "dealer"
  ),
  getAllPayments
);


// Mark Payment Paid
router.put(
  "/paid/:id",
  verifyToken,
  authorizeRoles("admin"),
  markPaid
);

module.exports = router;