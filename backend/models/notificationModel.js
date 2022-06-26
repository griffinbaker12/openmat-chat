const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
