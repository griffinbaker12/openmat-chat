const express = require('express');
const {
  accessChat,
  createChat,
  fetchChats,
} = require('../controllers/chatController');
const { decodeToken } = require('../middleware/authMiddleware');
// const { decodeToken } = require('../middleware/authMiddleware');

const router = express.Router();

// He has something where he says that if the chat is a group chat you click a flag but I don't really understand that, I think it should be enough to just have the recipients on the body of whatever you send from the front-end once you indicate with whom you'd like to chat
router.route('/accessChat').post(decodeToken, accessChat);
router.route('/createChat').post(decodeToken, createChat);

router.route('/').get(decodeToken, fetchChats);

// router.route('/removeUserFromchat').put(decodeToken, removeUserFromChat);
// router.route('/addUserToChat').put(decodeToken, addUserToChat);
// router.route('/renameChat').put(decodeToken, renameChat);

module.exports = router;
