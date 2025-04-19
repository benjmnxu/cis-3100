const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { required } = require('../middleware/authMiddleware');
const imageController = require('../controllers/imageController');

router.post('/images', required, upload.single('image'), imageController.uploadImage);
router.get('/recipes/:id/images', imageController.getImagesByRecipe);
router.delete('/images/:id', required, imageController.deleteImageById);
router.get('/dev/images', imageController.getAllImages);

module.exports = router;
