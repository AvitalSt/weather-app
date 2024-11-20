const axios = require('axios');
const User = require('../models/user');


async function getWeatherByCity(req, res) {
    const city = req.params.city;
    const apiKey = process.env.apiKey;
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
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
        if (user.favoriteCities.includes(city))
            return res.status(400).json({ message: 'City already in favorites' });

        user.favoriteCities.push(city);
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

module.exports = { getWeatherByCity, addFavoriteCity, getAllFavoriteCities }