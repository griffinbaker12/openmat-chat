const express = require('express');
const {
  allUsers,
  registerUser,
  loginUser,
} = require('../controllers/userController');
const { decodeToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser);
router.route('/').get(decodeToken, allUsers);
router.post('/login', loginUser);

module.exports = router;
