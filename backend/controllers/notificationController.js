const asyncHandler = require('express-async-handler');
const { restart } = require('nodemon');
const Message = require('../models/messageModel');
const Notification = require('../models/notificationModel');

const getNotifications = asyncHandler(async (req, res) => {
  const { user } = req;

  try {
    let notifications = await Notification.find({ user: user._id })
      .populate('message')
      .populate('user');

    notifications = await Message.populate(notifications, {
      path: 'message.chat',
    });
    notifications = await Message.populate(notifications, {
      path: 'message.chat.users',
    });
    console.log(notifications);

    res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addNotification = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const newNotification = {
    user: req.user._id,
    message,
  };

  try {
    let notification = await Notification.create(newNotification);
    notification = await notification.populate('message');
    notification = await notification.populate('message.chat');
    notification = await notification.populate('user', '-hash');
    res.json(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const removeNotification = asyncHandler(async (req, res) => {});

module.exports = { getNotifications, addNotification, removeNotification };
