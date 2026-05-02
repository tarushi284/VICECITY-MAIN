const Weather = require('../models/Weather');

const axios = require('axios');

// @desc    Get weather for a city
// @route   GET /api/weather/:city
// @access  Public
const getWeather = async (req, res) => {
    const city = req.params.city;

    try {
        console.log(`Fetching weather for: ${city}`);
        const url = `http://api.weatherstack.com/current`;
        const params = {
            access_key: process.env.WEATHERSTACK_API_KEY,
            query: city
        };
        // console.log('Request Params:', { ...params, access_key: 'HIDDEN' }); 

        const response = await axios.get(url, { params });

        // Check if response data is valid object and has 'current' property
        if (typeof response.data === 'string' || response.data.error || !response.data.current) {
            console.error('Weatherstack API returned error or invalid format (using mock data):', response.data);
            throw new Error('API Error or Invalid Format');
        }

        const current = response.data.current;
        const location = response.data.location;

        const weatherData = {
            city: location.name,
            temperature: current.temperature,
            condition: current.weather_descriptions[0],
            humidity: current.humidity,
            aqi: 100, // Weatherstack free plan doesn't provide AQI
            updatedAt: current.observation_time
        };

        res.json(weatherData);

    } catch (error) {
        console.error('Weather API Error (using mock data):', error.message);

        // Fallback Mock Data
        const mockData = {
            city: city,
            temperature: 28,
            condition: 'Sunny (Mock)',
            humidity: 45,
            aqi: 85,
            updatedAt: new Date(),
            note: 'Live data unavailable, showing mock data.'
        };
        res.json(mockData);
    }
};

// @desc    Update weather data (Admin/System)
// @route   POST /api/weather
// @access  Private/Admin
const updateWeather = async (req, res) => {
    const { city, temperature, condition, humidity, aqi } = req.body;

    let weather = await Weather.findOne({ city });

    if (weather) {
        weather.temperature = temperature;
        weather.condition = condition;
        weather.humidity = humidity;
        weather.aqi = aqi;
        weather.updatedAt = Date.now();

        const updatedWeather = await weather.save();
        res.json(updatedWeather);
    } else {
        const newWeather = new Weather({
            city,
            temperature,
            condition,
            humidity,
            aqi,
        });

        const createdWeather = await newWeather.save();
        res.status(201).json(createdWeather);
    }
};

module.exports = { getWeather, updateWeather };
