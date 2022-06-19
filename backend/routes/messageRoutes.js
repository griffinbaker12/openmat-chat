const express = require('express');
const {
  sendMessage,
  fetchChatMessages,
} = require('../controllers/messageController');
const { decodeToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(decodeToken, sendMessage);
router.route('/:chatId').get(decodeToken, fetchChatMessages);

module.exports = router;
