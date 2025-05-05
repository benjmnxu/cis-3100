const express = require('express');
const router = express.Router();
const { required } = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

router.post('/', required, chatController.chat);

module.exports = router;
