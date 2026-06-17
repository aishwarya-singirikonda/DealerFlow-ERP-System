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

// Add Product
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  addProduct
);

// Get All Products
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "staff"),
  getAllProducts
);

// Low Stock Products
router.get(
  "/low-stock",
  verifyToken,
  authorizeRoles("admin", "staff"),
  getLowStockProducts
);

// Get Product By ID
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "staff"),
  getProductById
);

// Update Product
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateProduct
);

// Delete Product
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteProduct
);

module.exports = router;