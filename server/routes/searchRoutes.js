const express = require('express');
const router = express.Router();
const { required } = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');

// 🔐 Protected
router.post('/search-history', required, searchController.addSearchEntry);
router.get('/search-history', required, searchController.getSearchHistory);

module.exports = router;
