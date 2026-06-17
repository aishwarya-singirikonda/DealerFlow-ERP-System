const pool = require("../config/db");

const addProduct = async (req, res) => {
  try {

    const {
      product_name,
      category,
      brand,
      price,
      stock_quantity
    } = req.body;

    const newProduct = await pool.query(
      `INSERT INTO products
      (product_name, category, brand, price, stock_quantity)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        product_name,
        category,
        brand,
        price,
        stock_quantity
      ]
    );

    res.status(201).json({
      success: true,
      product: newProduct.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const getAllProducts = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT *
       FROM products
       ORDER BY id DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const getProductById = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      product_name,
      category,
      brand,
      size,
      price,
      stock_quantity
    } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET
       product_name = $1,
       category = $2,
       brand = $3,
       size = $4,
       price = $5,
       stock_quantity = $6
       WHERE id = $7
       RETURNING *`,
      [
        product_name,
        category,
        brand,
        size,
        price,
        stock_quantity,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const getLowStockProducts = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT *
       FROM products
       WHERE stock_quantity < 10
       ORDER BY stock_quantity ASC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows
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
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts
};