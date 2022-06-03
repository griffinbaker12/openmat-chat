const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');

// Receive the users and the name of the chat and create a new chat
const createChat = asyncHandler(async (req, res) => {
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
    // Test if chat already exists between these users
    const queryForAlreadyExists = {
      $and: [
        { users: { _id: parsedUsersArray[0] } },
        { users: { _id: parsedUsersArray[1] } },
        { users: { _id: parsedUsersArray[2]._id } },
      ],
    };
    const alreadyExists = await Chat.findOne(queryForAlreadyExists);
    if (alreadyExists) {
      res.status(400).send('chat already exists');
      // throw new Error('chat already exists');
    }

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

  // res.json(users);

  // if (!userId) {
  //   console.log('UserId param not sent with request');
  //   return res.sendStatus(400);
  // }

  // var isChat = await Chat.find({
  //   isGroupChat: false,
  //   $and: [
  //     { users: { $elemMatch: { $eq: req.user._id } } },
  //     { users: { $elemMatch: { $eq: userId } } },
  //   ],
  // })
  //   .populate('users', '-password')
  //   .populate('latestMessage');

  // isChat = await User.populate(isChat, {
  //   path: 'latestMessage.sender',
  //   select: 'name pic email',
  // });

  // if (isChat.length > 0) {
  //   res.send(isChat[0]);
  // } else {
  //   var chatData = {
  //     chatName: 'sender',
  //     isGroupChat: false,
  //     users: [req.user._id, userId],
  //   };

  //   try {
  //     const createdChat = await Chat.create(chatData);
  //     const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
  //       'users',
  //       '-password'
  //     );
  //     res.status(200).json(FullChat);
  //   } catch (error) {
  //     res.status(400);
  //     throw new Error(error.message);
  //   }
  // }
});

module.exports = { createChat };
