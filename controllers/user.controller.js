import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });


    res.status(201).json({
      message: "User created successfully.",
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "login successfull",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const logout = (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id
      }
    });
    if (!user) {
      return res.status(404).json({
        message: "User details not found"
      });
    }

    const updatedUser = {
      username: username ?? user.username,
      email: email ?? user.email,
      password: password ?? user.password
    };

    const isUserUpdated = await User.update(updatedUser, {
      where: {
        id: req.params.id
      }
    });

    if (!isUserUpdated[0]) {
      return res.status(500).json({
        message: "Unable to update user profile"
      });
    }

    res.status(200).json({
      message: "Successfully updated the profile"
    });
  } catch (error) {
    return res.status(500).json({
      type: "Server error",
      message: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id
      }
    });
    if (!user) {
      return res.status(404).json({
        message: "User data not found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      typeof: "Server error",
      message: error.message
    });
  }
};
