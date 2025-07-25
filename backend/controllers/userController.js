import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

// @desc    Register a new user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  if (savedUser) {
    createToken(res, savedUser._id);
    return res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(401);
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid Password");
  }

  createToken(res, existingUser._id);

  return res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  });
});

// @desc    Logout user
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get all users (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  return res.json(users);
});

// @desc    Get current logged-in user's profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  return res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
  });
});

// @desc    Update logged-in user's profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
  }

  const updatedUser = await user.save();

  return res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
