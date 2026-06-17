const pool = require("../config/db");

const addDealer = async (req, res) => {
  try {

    const {
      dealer_name,
      owner_name,
      phone,
      email,
      address
    } = req.body;

    const result = await pool.query(
      `INSERT INTO dealers
      (
        dealer_name,
        owner_name,
        phone,
        email,
        address
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        dealer_name,
        owner_name,
        phone,
        email,
        address
      ]
    );

    res.status(201).json({
      success: true,
      dealer: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const getAllDealers = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT *
       FROM dealers
       ORDER BY id DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      dealers: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const getDealerById = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM dealers WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    res.status(200).json({
      success: true,
      dealer: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const updateDealer = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      dealer_name,
      owner_name,
      phone,
      email,
      address
    } = req.body;

    const result = await pool.query(
      `UPDATE dealers
       SET
       dealer_name = $1,
       owner_name = $2,
       phone = $3,
       email = $4,
       address = $5
       WHERE id = $6
       RETURNING *`,
      [
        dealer_name,
        owner_name,
        phone,
        email,
        address,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Dealer updated successfully",
      dealer: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
const deleteDealer = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM dealers WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Dealer deleted successfully",
      dealer: result.rows[0]
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
  addDealer,
  getAllDealers,
  getDealerById,
  updateDealer,
  deleteDealer
};