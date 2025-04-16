const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');

// 🔐 Protected
router.post('/search-history', authMiddleware, searchController.addSearchEntry);
router.get('/search-history', authMiddleware, searchController.getSearchHistory);

module.exports = router;
