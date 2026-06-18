const express = require("express");

const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require("../controllers/productController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");


// ADD PRODUCT (admin only)
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  addProduct
);


// GET ALL PRODUCTS (ADMIN + STAFF + DEALER) ✅ FIXED
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "staff", "dealer"),
  getAllProducts
);


// LOW STOCK (admin + staff + dealer)
router.get(
  "/low-stock",
  verifyToken,
  authorizeRoles("admin", "staff", "dealer"),
  getLowStockProducts
);


// GET PRODUCT BY ID
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "staff", "dealer"),
  getProductById
);


// UPDATE PRODUCT (admin only)
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateProduct
);


// DELETE PRODUCT (admin only)
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteProduct
);

module.exports = router;