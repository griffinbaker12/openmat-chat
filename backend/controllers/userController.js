const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hash = bcrypt.hashSync(password);

  const user = await User.create({
    name,
    email,
    hash,
    picture,
  });

  if (user) {
    // 201 for creates, 200 for updates
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Failed to create new user');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  const user = await User.findOne({ email });

  const isValidPassword = bcrypt.compareSync(password, user.hash);

  if (user && isValidPassword) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid user credentials');
  }
});

module.exports = { registerUser, loginUser };
