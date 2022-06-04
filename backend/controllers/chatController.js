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
      .populate('chatCreator', '-password');

    res.json(fullChat);
  } catch (e) {
    console.log('error creating chat');
  }
});

// Check which user is logged in and then send them all the chats of which they are apart; the MW makes it so that we always have the current user and that is very handy
const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Find the chats where the element (b/c we are dealing with object ids) is equal to the user id that we have received (from the MW)
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } });
  } catch (error) {}
});

module.exports = { accessChat, createChat, fetchChats };
