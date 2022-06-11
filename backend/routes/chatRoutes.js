const express = require('express');
const {
  accessChat,
  createChat,
  fetchChats,
  renameChat,
  addUserToChat,
  removeUserFromChat,
} = require('../controllers/chatController');
const { decodeToken } = require('../middleware/authMiddleware');
// const { decodeToken } = require('../middleware/authMiddleware');

const router = express.Router();

// He has something where he says that if the chat is a group chat you click a flag but I don't really understand that, I think it should be enough to just have the recipients on the body of whatever you send from the front-end once you indicate with whom you'd like to chat
router.route('/accessChat').post(decodeToken, accessChat);
router.route('/createChat').post(decodeToken, createChat);

router.route('/').get(decodeToken, fetchChats);

router.route('/renameChat').put(decodeToken, renameChat);
router.route('/addUserToChat').put(decodeToken, addUserToChat);

// This route is more like leave chat since I only want someone to be able to leave and not for someone to be able to remove someone from the chat
router.route('/removeUserFromChat').put(decodeToken, removeUserFromChat);

module.exports = router;
