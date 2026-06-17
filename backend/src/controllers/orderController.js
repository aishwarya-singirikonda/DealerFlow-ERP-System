const pool = require("../config/db");

const createOrder = async (req, res) => {
  try {
    const { dealer_id, items } = req.body;

    // Validation
    if (!dealer_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Dealer and items are required"
      });
    }

    // Check dealer exists
    const dealerResult = await pool.query(
      "SELECT * FROM dealers WHERE id = $1",
      [dealer_id]
    );

    if (dealerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Calculate total amount
    let totalAmount = 0;

    for (const item of items) {

      const productResult = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product_id} not found`
        });
      }

      const product = productResult.rows[0];

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.product_name}`
        });
      }

      totalAmount += Number(product.price) * Number(item.quantity);
    }

    // Create Order
    const orderResult = await pool.query(
      `INSERT INTO orders
      (
        dealer_id,
        total_amount
      )
      VALUES ($1, $2)
      RETURNING *`,
      [
        dealer_id,
        totalAmount
      ]
    );

    const order = orderResult.rows[0];

    // Create Order Items
    for (const item of items) {

      const productResult = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [item.product_id]
      );

      const product = productResult.rows[0];

      await pool.query(
        `INSERT INTO order_items
        (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES ($1, $2, $3, $4)`,
        [
          order.id,
          item.product_id,
          item.quantity,
          product.price
        ]
      );
    }

    // Success Response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

const approveOrder = async (req, res) => {
  try {

    const { id } = req.params;

    // Check Order
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const order = orderResult.rows[0];

    if (order.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Order already approved"
      });
    }

    // Get Order Items
    const itemsResult = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [id]
    );

    // Reduce Product Stock
    for (const item of itemsResult.rows) {

      await pool.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1
         WHERE id = $2`,
        [
          item.quantity,
          item.product_id
        ]
      );

    }

    // Update Order Status
    await pool.query(
      `UPDATE orders
       SET status = 'Approved'
       WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Order approved successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const getAllOrders = async (req, res) => {
  try {

    const orders = await pool.query(`
      SELECT
        o.id,
        d.dealer_name,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      JOIN dealers d
      ON o.dealer_id = d.id
      ORDER BY o.created_at DESC
    `);

    res.status(200).json({
      success: true,
      count: orders.rows.length,
      orders: orders.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const updateOrderStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Rejected",
      "Delivered"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: result.rows[0]
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
  createOrder,
  approveOrder,
  getAllOrders,
  updateOrderStatus
};