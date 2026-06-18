const pool = require("../config/db");


// GET ALL USERS (ADMIN)
const getAllUsers = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        dealer_id
      FROM users
      ORDER BY id DESC
      `
    );

    res.status(200).json({
      success: true,
      users: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};


// UPDATE USER ROLE
const updateUserRole = async (req, res) => {

  try {

    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["admin", "staff", "dealer"];

    if (!allowedRoles.includes(role)) {

      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });

    }

    const result = await pool.query(
      `
      UPDATE users
      SET role = $1
      WHERE id = $2
      RETURNING id, name, email, role
      `,
      [role, id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      user: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};


// DELETE USER
const deleteUser = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
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
  getAllUsers,
  updateUserRole,
  deleteUser
};
