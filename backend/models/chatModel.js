const mongoose = require('mongoose');

// id
// users
// messages

// How are the messages getting stored at all?

// And then on the client side they would want to see the chat and maybe the participants in the chat, but not see their own name up there and I think you can do it in a similar way to what we did when you search for results, you just filter through and check based on it not being equal to the id with the user property that we append onto the request object, that is a really cool pattern to essentially filter out the results that we show the user

// You obviously could go through as well and access the images of the user themselves so that they show in the sidebar view or in the chat itself when they send the message
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
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    chatCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
