const pool = require("../config/db");

const getDashboardSummary = async (req, res) => {
  try {

    const dealers = await pool.query(
      "SELECT COUNT(*) FROM dealers"
    );

    const products = await pool.query(
      "SELECT COUNT(*) FROM products"
    );

    const orders = await pool.query(
      "SELECT COUNT(*) FROM orders"
    );

    const revenue = await pool.query(
      "SELECT COALESCE(SUM(total_amount),0) FROM orders WHERE status='Approved'"
    );

    const pendingOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status='Pending'"
    );

    const approvedOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status='Approved'"
    );

    res.status(200).json({
      success: true,
      summary: {
        totalDealers: Number(dealers.rows[0].count),
        totalProducts: Number(products.rows[0].count),
        totalOrders: Number(orders.rows[0].count),
        totalRevenue: Number(revenue.rows[0].coalesce),
        pendingOrders: Number(pendingOrders.rows[0].count),
        approvedOrders: Number(approvedOrders.rows[0].count)
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

module.exports = {
  getDashboardSummary
};