const db = require('../db');
const path = require('path');

// ✅ Upload a new image (requires valid recipe_id)
exports.uploadImage = async (req, res) => {
  try {
    const { recipe_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    if (!recipe_id) {
      return res.status(400).json({ message: 'recipe_id is required' });
    }

    const recipeExists = await db('recipes').where({ id: recipe_id }).first();
    if (!recipeExists) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const filePath = `/uploads/${req.file.filename}`;

    const [image] = await db('images')
      .insert({
        recipe_id,
        file_path: filePath
      })
      .returning(['id', 'file_path', 'recipe_id', 'uploaded_at']);

    res.status(201).json({ message: 'Image uploaded', image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

// ✅ Get all images for a given recipe_id
exports.getImagesByRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const images = await db('images')
      .where({ recipe_id: id })
      .select('id', 'file_path', 'uploaded_at');

    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching images for recipe' });
  }
};

// ✅ Delete a single image by image ID
exports.deleteImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db('images').where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting image' });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await db('images').select('id', 'file_path', 'recipe_id', 'uploaded_at');
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching all images' });
  }
};