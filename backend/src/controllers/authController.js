const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER USER
const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      dealer_id
    } = req.body;

    if (!name || !email || !password || !role) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {

      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });

    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const newUser = await pool.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role,
        dealer_id
      )
      VALUES
      ($1,$2,$3,$4,$5)
      RETURNING
      id,
      name,
      email,
      role,
      dealer_id
      `,
      [
        name,
        email,
        hashedPassword,
        role,
        dealer_id || null
      ]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};


// LOGIN USER
const loginUser = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });

    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });

    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });

    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        dealer_id: user.dealer_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        dealer_id: user.dealer_id
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


// GET PROFILE
const getProfile = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
      id,
      name,
      email,
      role,
      phone,
      address
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
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


// UPDATE PROFILE
const updateProfile = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      address
    } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
      name = $1,
      email = $2,
      phone = $3,
      address = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        name,
        email,
        phone,
        address,
        req.user.id
      ]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
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


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
};
