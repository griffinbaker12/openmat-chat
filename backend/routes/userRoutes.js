const express = require('express');
const {
  allUsers,
  registerUser,
  loginUser,
  addFriend,
  removeFriend,
  validateUserName,
} = require('../controllers/userController');
const { decodeToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser);
router.route('/').get(decodeToken, allUsers);
router.route('/validateUserName').post(validateUserName);
router.post('/login', loginUser);

router.route('/addFriend').put(decodeToken, addFriend);
router.route('/removeFriend').put(decodeToken, removeFriend);

module.exports = router;
