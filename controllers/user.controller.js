import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { JWT_SECRET } from "../index.js";
import { getUserId } from "../services/getUserId.js"; // this function extracts info from JWT token through request headers
// Controllers for user signup, login, logout, update profile and get profile


export const signup = async (req, res, next) => {
  const { username, email, password } = req.body; // extract user details from body

  if (!username || !email || !password) { // if any field is missing
    const err = new Error("All fields are required.");
    err.statusCode = 400
    throw err
  }
  try {
    const existingUser = await User.findOne({ where: { email } }); // check if the email already exists
    if (existingUser) {
      const err = new Error("Email already in use.");
      err.statusCode = 400
      throw err
    }
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password

    const user = await User.create({ // create the user
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User created successfully.",
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    next(err) // pass the error to error handling middleware
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) { // if any field is missing thow error
    const err = new Error("All fields are required")
    err.statusCode = 400
    throw err
  }

  try {
    const user = await User.findOne({ where: { email } }); // get the user details from DB

    if (!user) { // throw error if no user found
      const err = new Error("Invalid email")
      err.statusCode = 401
      throw err
    }

    // Compare password to check if it matches
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) { // throw error invalid password
      const err = new Error("Invalid password")
      err.statusCode = 401
      throw err
    }

    // generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" }); // token valid for 1 hour

    return res.status(200).json({
      message: "login successfull",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token // sharing token with user in response
    });
  } catch (err) {
    next(err)
  }
};

export const logout = (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res, next) => {
  const { username, email, password } = req.body;
  const userId = getUserId(req).userId;

  try {
    // get the user details
    const user = await User.findOne({
      where: {
        id: userId
      }
    });
    if (!user) { // throw error user not found
      const err = new Error("User details not found")
      err.statusCode = 404
      throw err
    }

    const hashedPass = bcrypt.hash(password, 10); // hash the password

    // user details object with updated details
    const updatedUser = {
      username: username ?? user.username,
      email: email ?? user.email,
      password: hashedPass ?? user.password
    };

    // update the user details in DB
    // this function return an array with first elem showing number of records updated
    const isUserUpdated = await User.update(updatedUser, {
      where: {
        id: userId
      }
    });

    if (!isUserUpdated[0]) {
      const err = new Error("Unable to update user profile")
      err.statusCode = 500
      throw err
    }

    res.status(200).json({
      message: "Successfully updated the profile"
    });
  } catch (error) {
    next(error)
  }
};

export const getProfile = async (req, res, next) => {
  const userId = getUserId(req).userId;

  try {
    const user = await User.findOne({ // get the user details from DB
      where: {
        id: userId
      }
    });
    if (!user) {
      const err = new Error("User data not found")
      err.statusCode = 404
      next(err)
    }

    res.status(200).json(user);
  } catch (error) {
    next(error)
  }
};
