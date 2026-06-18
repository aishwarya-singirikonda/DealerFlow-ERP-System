const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dealerRoutes = require("./routes/dealerRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DealerFlow API Running"
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Dealer Routes
app.use("/api/dealers", dealerRoutes);

// Product Routes
app.use("/api/products", productRoutes);
// Order Routes
app.use("/api/orders", orderRoutes);
// Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);
// Payment Routes
app.use("/api/payments", paymentRoutes);
// User Routes
app.use("/api/users", userRoutes);
module.exports = app;