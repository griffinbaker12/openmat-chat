const express = require('express');
const {
  getNotifications,
  addNotification,
  removeNotification,
} = require('../controllers/notificationController');
const { decodeToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(decodeToken, getNotifications);
router.route('/addNotification').post(decodeToken, addNotification);
router.route('/removeNotification').post(decodeToken, removeNotification);

module.exports = router;
