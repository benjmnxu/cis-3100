const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const imageRoutes = require('./routes/imageRoutes'); 
const searchRoutes = require('./routes/searchRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const chatRoutes = require(`./routes/chatRoutes`);


const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Adjust if frontend is elsewhere
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Serve uploaded images from /uploads path
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (req, res) => {
  res.send('✅ Kitchen Scout backend running!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api', imageRoutes); 
app.use('/api', searchRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes)



// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});
