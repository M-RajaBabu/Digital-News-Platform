// Weather widget API controller
// This would typically integrate with a weather service like OpenWeatherMap

// Mock weather data for demonstration
const mockWeatherData = {
  'Mumbai': {
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 75,
    windSpeed: 12,
    icon: 'partly-cloudy-day'
  },
  'Delhi': {
    temperature: 32,
    condition: 'Sunny',
    humidity: 45,
    windSpeed: 8,
    icon: 'clear-day'
  },
  'Bangalore': {
    temperature: 24,
    condition: 'Light Rain',
    humidity: 80,
    windSpeed: 15,
    icon: 'rain'
  }
};

// Get weather for a specific city
exports.getWeather = async (req, res) => {
  try {
    const { city } = req.params;
    const { units = 'celsius' } = req.query;

    // In a real implementation, this would call a weather API
    // const weatherData = await weatherService.getWeather(city, units);
    
    // For now, return mock data
    const weatherData = mockWeatherData[city] || {
      temperature: 25,
      condition: 'Unknown',
      humidity: 60,
      windSpeed: 10,
      icon: 'unknown'
    };

    res.json({
      success: true,
      weather: {
        city,
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        icon: weatherData.icon,
        units,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get weather error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch weather data',
      status: 500
    });
  }
};

// Get weather for multiple cities
exports.getWeatherMultiple = async (req, res) => {
  try {
    const { cities } = req.query;
    const { units = 'celsius' } = req.query;

    if (!cities) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Cities parameter is required',
        status: 400
      });
    }

    const cityList = cities.split(',');
    const weatherData = {};

    // In a real implementation, this would call a weather API for each city
    for (const city of cityList) {
      weatherData[city] = mockWeatherData[city] || {
        temperature: 25,
        condition: 'Unknown',
        humidity: 60,
        windSpeed: 10,
        icon: 'unknown'
      };
    }

    res.json({
      success: true,
      weather: weatherData,
      units,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get weather multiple error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch weather data',
      status: 500
    });
  }
};

// Get weather forecast
exports.getForecast = async (req, res) => {
  try {
    const { city } = req.params;
    const { days = 5 } = req.query;

    // Mock forecast data
    const forecast = [];
    for (let i = 1; i <= Math.min(days, 7); i++) {
      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        high: 25 + Math.floor(Math.random() * 10),
        low: 15 + Math.floor(Math.random() * 10),
        condition: ['Sunny', 'Partly Cloudy', 'Light Rain', 'Cloudy'][Math.floor(Math.random() * 4)],
        icon: ['clear-day', 'partly-cloudy-day', 'rain', 'cloudy'][Math.floor(Math.random() * 4)]
      });
    }

    res.json({
      success: true,
      forecast: {
        city,
        days: forecast,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get forecast error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch weather forecast',
      status: 500
    });
  }
}; 