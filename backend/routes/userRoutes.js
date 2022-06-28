const express = require('express');
const {
  allUsers,
  registerUser,
  loginUser,
  addFriend,
  removeFriend,
  validateUserName,
  getUserInfo,
  changeProfilePicture,
} = require('../controllers/userController');
const { decodeToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser);
router.route('/').get(decodeToken, allUsers);
router.route('/getUserInfo').get(decodeToken, getUserInfo);
router.route('/validateUserName').post(validateUserName);
router.post('/login', loginUser);

router.route('/addFriend').put(decodeToken, addFriend);
router.route('/removeFriend').put(decodeToken, removeFriend);

router.route('/changeProfilePicture').put(decodeToken, changeProfilePicture);

module.exports = router;
