const mongoose = require('mongoose');

// id
// users
// messages

const chatSchema = mongoose.Schema(
  {
    users: [
      {
        // Will contain the id of the particular user
        type: mongoose.Schema.Types.ObjectId,
        // Reference to the user model
        ref: 'User',
      },
    ],
    latestMessage: {
      // Same idea as above, this message will be one stored in our db; and the ref will be to the particular part of our db where messages are stored
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
