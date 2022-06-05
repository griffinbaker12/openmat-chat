const { json } = require('express');
const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  var isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-hash')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name picture email',
  });

  console.log(isChat, 'with populate');

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// Receive the users and the name of the chat and create a new chat
const createChat = asyncHandler(async (req, res) => {
  // He has some check where he looks to see if the id has
  // been sent already

  const { users, chatName } = req.body;

  // We are going to send an array, but we cannot just send an array directly, so need to send it in the stringified format so we need to parse it here
  const parsedUsersArray = JSON.parse(users);
  // console.log(parsedUsersArray, 'parsed chat participant array');
  // console.log('current user', req.user._id);

  if (!users || !chatName) {
    return res.status(400).send({ message: 'Please fill all the fields' });
  }

  parsedUsersArray.push(req.user);
  // Really pretty cool, it extracts the Object Id from the current user property on the request object
  // console.log('this is the parsed user array', parsedUsersArray);

  // Should somehow be able to check if there exists a chat with the same users already

  // Create a new chat
  try {
    // I could potentially do this on the front end as well...may be easier to implement...stay tuned; so I think that we store the chats on the front end
    // anyway, so before a user enters a chat, we want to check whether the chat already exists, and if it does, then alert the user

    const newChat = await Chat.create({
      chatName,
      users: parsedUsersArray,
      chatCreator: req.user,
    });

    // One question is why does our id auto get pushed into the array, but the id for the chat creator does not, it pushes the howle object?
    // console.log(newChat);

    // Each object that gets created seems to have an id attached to it, and that is how all of these things are linked together
    const fullChat = await Chat.findOne({ _id: newChat._id })
      .populate('users', '-password')
      .populate('chatCreator', '-password')
      .populate('latestMessage');

    res.json(fullChat);
  } catch (e) {
    console.log('error creating chat');
  }
});

// Check which user is logged in and then send them all the chats of which they are apart; the MW makes it so that we always have the current user and that is very handy
const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Find the chats where the element (b/c we are dealing with object ids) is equal to the user id that we have received (from the MW)
    // Since we do not have any data fields in the latest message right now that does not show up in Postman apparently
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-hash')
      .populate('chatCreator', '-hash')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async results => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name picture email',
        });
        res.send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameChat = asyncHandler(async (req, res) => {
  // I would assume here that we receive an id of the chat and then the name to which we want to rename it
  const { chatId, chatName } = req.body;

  // Does not really make sense why we need to put the new true if we are updating this stuff
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate('users', '-password')
    .populate('chatCreator', '-password');

  if (!updatedChat) {
    res.status(404);
    throw new Error('Chat not found');
  } else {
    res.json(updatedChat);
  }
});

const addUserToChat = asyncHandler(async (req, res) => {
  // We need to chat to which we are going to add the specified user
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('chatCreator', '-password');

  console.log(added);

  if (!added) {
    res.status(404);
    throw new Error('Chat not found');
  } else {
    res.json(added);
  }
});

const removeUserFromChat = asyncHandler(async (req, res) => {
  // We need to chat to which we are going to add the specified user
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('chatCreator', '-password');

  if (!removed) {
    res.status(404);
    throw new Error('Chat not found');
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  createChat,
  fetchChats,
  renameChat,
  addUserToChat,
  removeUserFromChat,
};
