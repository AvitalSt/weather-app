const axios = require('axios');
const User = require('../models/user');
const { sendWeatherEmail } = require('./mailer');

const BASE_API_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.apiKey;

async function getWeatherByCity(req, res) {
    const city = req.params.city;
    try {
        const response = await axios.get(`${BASE_API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching weather data', message: error.message });
    }
}

async function addFavoriteCity(req, res) {
    const { city } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const favoriteCitiesSet = new Set(user.favoriteCities);
        if (favoriteCitiesSet.has(city)) {
            return res.status(400).json({ message: 'City already in favorites' });
        }
        favoriteCitiesSet.add(city);
        user.favoriteCities = Array.from(favoriteCitiesSet);
        await user.save();
        return res.status(200).json({ message: `${city} added to favorites` });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function getAllFavoriteCities(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const favoriteCities = user.favoriteCities;
        return res.status(200).json({ favoriteCities });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function sendDailyWeatherEmails() {
    const users = await User.find();
    for (const user of users) {
        const city = user.city;
        try {
            const weather = await axios.get(`${BASE_API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
            const weatherInfo = `The temperature is ${weather.data.main.temp}°C with ${weather.data.weather[0].description}`;
            const emailSent = await sendWeatherEmail(user.email, city, weatherInfo);
            if (!emailSent) {
                console.log(`We couldn't send the email to user ${user.email}`);
                continue;
            }
            console.log(`The email was successfully sent to user ${user.email}`);
        } catch (error) {
            console.error(`We couldn't fetch the weather for the city ${city}:`, error.message);
        }
    }
}

module.exports = { getWeatherByCity, addFavoriteCity, getAllFavoriteCities, sendDailyWeatherEmails }