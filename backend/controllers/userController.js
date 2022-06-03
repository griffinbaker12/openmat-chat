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
      _id: user._id,
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
      _id: user._id,
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

const allUsers = asyncHandler(async (req, res) => {
  console.log(req.headers);
  const query = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  // Means that we need to pass in the current user id
  // We also pass the user back a token after they sign in, but we don't want this to be revealed to anyone else I guess, but once we get someone's _id, we can just generate the exact same token again to verify them which is pretty sweet and why it is useful

  // This makes it so that the user who actually sends the request does not get any data back about themselves, and we do this by running it through the middleware. This is so sick, is a means of us being able to authorize what data is available to the person that is currently logged in and will change depending on who is actually logged in..super cool b/c then we can just run this whenever we want to actually remove the user themselves from any searches
  const users = await User.find(query).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, loginUser, allUsers };
