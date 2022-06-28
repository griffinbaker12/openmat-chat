const asyncHandler = require('express-async-handler');
const { restart } = require('nodemon');
const Message = require('../models/messageModel');
const Notification = require('../models/notificationModel');
const Chat = require('../models/chatModel');

const getNotifications = asyncHandler(async (req, res) => {
  const { user } = req;

  try {
    let notifications = await Notification.find({ user: user._id })
      .populate('message')
      .populate('user')
      .populate('chat');

    notifications = await Message.populate(notifications, {
      path: 'message.chat',
    });
    notifications = await Message.populate(notifications, {
      path: 'message.chat.users',
    });

    res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addNotification = asyncHandler(async (req, res) => {
  const { message, userId } = req.body;
  let newNotification;

  if (userId) {
    newNotification = {
      user: userId,
      message,
      chat: message.chat,
    };
  } else {
    newNotification = {
      user: req.user._id,
      message,
      chat: message.chat,
    };
  }

  // console.log(userId, newNotification);

  try {
    let notification = await Notification.create(newNotification);
    notification = await notification.populate('message');
    notification = await notification.populate('message.chat');
    notification = await notification.populate('message.chat.users');
    notification = await notification.populate('user', '-hash');
    notification = await notification.populate('chat');
    res.json(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const removeNotification = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const { user } = req;

  try {
    const chat = await Chat.findById({ _id: chatId });

    let removed = await Notification.deleteMany({
      $and: [{ user: user._id }, { chat: chat._id }],
    });

    let notifications = await Notification.find({ user: user._id })
      .populate('message')
      .populate('user')
      .populate('chat');

    notifications = await Message.populate(notifications, {
      path: 'message.chat',
    });
    notifications = await Message.populate(notifications, {
      path: 'message.chat.users',
    });

    res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { getNotifications, addNotification, removeNotification };
