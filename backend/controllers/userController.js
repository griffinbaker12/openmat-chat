const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
const generateToken = require('../config/generateToken');

const validateUserName = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  const userNameExists = await User.findOne({ userName });

  // console.log(userNameExists);

  if (userNameExists) {
    res.json(true);
  } else {
    res.json(false);
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture, userName } = req.body;

  if (!name || !email || !password || !userName) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  const userExists = await User.findOne({ $or: [{ email }, { userName }] });

  if (userExists) {
    res.status(400);
    console.log(userExists);
    throw new Error('User already exists');
  }

  const hash = bcrypt.hashSync(password);

  const user = await User.create({
    name,
    email,
    hash,
    picture,
    userName,
  });

  if (user) {
    // 201 for creates, 200 for updates
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      userName: user.userName,
      token: generateToken(user._id),
      friends: [],
    });
  } else {
    res.status(400);
    throw new Error('Failed to create new user');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { emailOrUserName, password } = req.body;

  if (!emailOrUserName || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  // const user = await User.findOne({
  //   or: [
  //     { email: { $eq: emailOrUserName } },
  //     { userName: { $eq: emailOrUserName } },
  //   ],
  // }).populate('friends', '-hash');

  const user = await User.findOne({
    $or: [
      { email: { $eq: emailOrUserName } },
      { userName: { $eq: emailOrUserName } },
    ],
  }).populate('friends', '-hash');

  const isValidPassword = bcrypt.compareSync(password, user.hash);

  if (user && isValidPassword) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
      friends: user.friends,
      userName: user.userName,
    });
  } else {
    res.status(401);
    throw new Error('Invalid user credentials');
  }
});

const getUserInfo = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) return;

  const user = await User.findOne({ _id: id });
  if (user) {
    res.json(user);
  } else {
    res.status(401);
    throw new Error('Invalid user credentials');
  }
});

// This name sucks, need to change it

const allUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  if (!search) return;

  const userQuery = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { userName: { $regex: search, $options: 'i' } },
    ],
  };
  const messageQuery = { text: { $regex: search, $options: 'i' } };

  // Means that we need to pass in the current user id
  // We also pass the user back a token after they sign in, but we don't want this to be revealed to anyone else I guess, but once we get someone's _id, we can just generate the exact same token again to verify them which is pretty sweet and why it is useful

  // This makes it so that the user who actually sends the request does not get any data back about themselves, and we do this by running it through the middleware. This is so sick, is a means of us being able to authorize what data is available to the person that is currently logged in and will change depending on who is actually logged in..super cool b/c then we can just run this whenever we want to actually remove the user themselves from any searches
  const users = await User.find(userQuery).find({ _id: { $ne: req.user._id } });
  const messages = await Message.find(messageQuery);
  res.send({ users, messages });
});

const addFriend = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const addedFriend = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { friends: userId } },
    { new: true }
  ).populate('friends', '-hash');

  if (!addFriend) {
    throw new Error('Error adding friend');
  }

  res.json(addedFriend);
});

const removeFriend = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const userWithFriendRemoved = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { friends: userId } },
    { new: true }
  ).populate('friends', '-hash');

  if (!userWithFriendRemoved) {
    throw new Error('Error removing friend');
  }

  res.json(userWithFriendRemoved);
});

module.exports = {
  validateUserName,
  registerUser,
  loginUser,
  allUsers,
  addFriend,
  removeFriend,
  getUserInfo,
};
