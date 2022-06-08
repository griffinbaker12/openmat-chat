const mongoose = require('mongoose');

// name
// email
// password
// picture

// Something here is that you would probably want to be able to store their friends so that they can add them to a chat. Should be able to message anybody, but also easily add them as a friend as well and can be able to view your friends

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    picture: {
      type: String,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    friends: [
      {
        // Will contain the id of the particular user
        type: mongoose.Schema.Types.ObjectId,
        // Reference to the user model
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
