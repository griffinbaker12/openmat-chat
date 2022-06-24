const asyncHandler = require('express-async-handler');
const { restart } = require('nodemon');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const sendMessage = asyncHandler(async (req, res) => {
  const { text, chatId } = req.body;

  if (!text || !chatId) {
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    text,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    // We are populating the instance of the mongoose class and not directly from the query above ??
    message = await message.populate('sender', 'userName picture');
    message = await message.populate('chat');

    // console.log('first message', message);

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { latestMessage: message },
      { new: true }
    );

    message = await Chat.populate(message, {
      path: 'chat',
    });

    message = await message.populate('chat.users');
    message = await message.populate('chat.latestMessage');
    message = await message.populate('chat.latestMessage.sender');
    message = await message.populate('chat.latestMessage.chat');

    // console.log(message);

    // console.log('updated chat', updatedChat);

    // // message = await Chat.populate(message, {
    // //   path: 'chat',
    // // });

    // message = await Chat.populate(message, {
    //   path: 'chat.latestMessage',
    // });

    // console.log(message);

    // message = await User.populate(message, {
    //   path: 'chat.users',
    //   select: 'userName name picture',
    // });

    // console.log(message);

    res.json(message);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

const fetchChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    const chatMessages = await Message.find({ chat: chatId })
      .populate('sender', 'userName picture')
      .populate('chat');

    res.json(chatMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, fetchChatMessages };
