const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const categoryRoutes = require('./routes/categories');
const bookmarkRoutes = require('./routes/bookmarks');
const authorRoutes = require('./routes/authors');
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscriptions');
const pollRoutes = require('./routes/polls');
const notificationRoutes = require('./routes/notifications');
const epaperRoutes = require('./routes/epaper');
const weatherRoutes = require('./routes/weather');
const gamesRoutes = require('./routes/games');
const newsletterRoutes = require('./routes/newsletter');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const isProduction = process.env.NODE_ENV === 'production';
const limiter = rateLimit({
  windowMs: isProduction ? (parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) : 60 * 1000, // 1 min for dev
  max: isProduction ? (parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100) : 10000, // much higher for dev
  message: {
    error: 'Too many requests from this IP, please try again later.',
    status: 429
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Digital News Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/epaper', epaperRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/search', searchRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    status: 404
  });
});

// Global error handler
app.use(errorHandler);

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Starting database sync...');
      await sequelize.sync({ force: true });
      console.log('✅ Database synchronized.');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Digital News Platform API running on port ${PORT}`);
      console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app; 