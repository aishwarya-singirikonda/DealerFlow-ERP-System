const pool = require("../config/db");

// Add Payment
const addPayment = async (req, res) => {
  try {

    const {
      order_id,
      dealer_id,
      amount,
      payment_method
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO payments
      (
        order_id,
        dealer_id,
        amount,
        payment_method
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        order_id,
        dealer_id,
        amount,
        payment_method
      ]
    );

    res.status(201).json({
      success: true,
      payment: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

// Get All Payments
const getAllPayments = async (req, res) => {

  try {

    let result;

    // Dealer sees only his payments
    if (req.user.role === "dealer") {

      result = await pool.query(
        `
        SELECT
          p.id,
          d.dealer_name,
          p.amount,
          p.payment_method,
          p.payment_status,
          p.payment_date
        FROM payments p
        JOIN dealers d
        ON p.dealer_id = d.id
        WHERE p.dealer_id = $1
        ORDER BY p.payment_date DESC
        `,
        [req.user.dealer_id]
      );

    }

    // Admin sees all payments
    else {

      result = await pool.query(
        `
        SELECT
          p.id,
          d.dealer_name,
          p.amount,
          p.payment_method,
          p.payment_status,
          p.payment_date
        FROM payments p
        JOIN dealers d
        ON p.dealer_id = d.id
        ORDER BY p.payment_date DESC
        `
      );

    }

    res.status(200).json({
      success: true,
      payments: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};
// Mark Paid
const markPaid = async (req,res)=>{

  try{

    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE payments
      SET payment_status='Paid'
      WHERE id=$1
      RETURNING *
      `,
      [id]
    );

    res.status(200).json({
      success:true,
      payment:result.rows[0]
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Server Error"
    });

  }

};

module.exports = {
  addPayment,
  getAllPayments,
  markPaid
};