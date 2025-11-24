// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Basic input validation
function isValidUsername(username) {
  return typeof username === "string" && username.trim().length >= 3;
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

exports.signup = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!isValidUsername(username) || !isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        error: "Invalid username or password (min 3 chars username, min 6 chars password).",
      });
    }

    const existing = await User.findOne({ username: username.trim() });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "Username already taken" });
    }

    const user = await User.create({
      username: username.trim(),
      password,
      role: role === "admin" ? "admin" : "user", // only allow user/admin
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!isValidUsername(username) || !isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        error: "Invalid username or password format.",
      });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Server error" });
  }
};
