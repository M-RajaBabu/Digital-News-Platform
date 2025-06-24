const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Get weather for a specific city
router.get('/:city', weatherController.getWeather);

// Get weather for multiple cities
router.get('/', weatherController.getWeatherMultiple);

// Get weather forecast
router.get('/:city/forecast', weatherController.getForecast);

module.exports = router; 