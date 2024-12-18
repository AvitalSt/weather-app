import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getWeatherByCity, addCityToFavorites } from '../services/weatherService';
import { useNavigate } from 'react-router-dom';
import './weather.css';

import sunnyImage from '../assets/sunny.jpg';
import rainyImage from '../assets/rainy.jpg';
import cloudyImage from '../assets/cloudy.jpg';
import snowyImage from '../assets/snowy.jpg';
import stormyImage from '../assets/stormy.jpg';

export default function Weather() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState('');
    const navigate = useNavigate();

    const weatherToImage = (description) => {
        if (description.includes('rain')) return rainyImage;
        if (description.includes('cloud')) return cloudyImage;
        if (description.includes('snow')) return snowyImage;
        if (description.includes('storm')) return stormyImage;
        return sunnyImage;
    };

    const fetchWeather = async (cityToFetch) => {
        try {
            setWeather(null);
            setError(null);
            const data = await getWeatherByCity(cityToFetch);
            setWeather(data);
            setBackgroundImage(weatherToImage(data.weather[0].description.toLowerCase()));
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchAddToFavorite = async (city) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setError(null);
                await getWeatherByCity(city);
                const data = await addCityToFavorites(city);
                alert(data.message)
            } catch (err) {
                console.log(err.message);
                if (err.message === 'Invalid or expired token') {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                else if (err.message === 'City not found') {
                    setError('The specified city does not exist');
                }
                else {
                    setError(err.message);
                }
            }
        }
        else
            navigate('/login');
    }

    const handleShowFavorites = () => {
        if (isLoggedIn()) {
            navigate('/favorites');
        } else {
            navigate('/login');
        }
    };

    const isLoggedIn = () => {
        return localStorage.getItem('token') !== null;
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.city) {
            fetchWeather(user.city);
        } else {
            fetchWeather('Jerusalem');
        }
    }, []);


    return (
        <div className="weather-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className="weather-box" component="form" noValidate autoComplete="off">
                <h2 className="weather-title">Weather Search</h2>
                <TextField
                    className="weather-field"
                    id="outlined-basic"
                    label="City"
                    variant="outlined"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <Button
                    className="weather-button"
                    variant="contained"
                    onClick={() => fetchWeather(city)}
                >
                    Get Weather
                </Button>
                <Button
                    className="weather-button"
                    variant="contained"
                    onClick={() => fetchAddToFavorite(city)}
                >
                    Add to favorite
                </Button>
                <Button
                    className="weather-button"
                    variant="contained"
                    onClick={handleShowFavorites}
                >
                    Show Favorite Cities
                </Button>
                {weather && (
                    <div className="weather-info">
                        <div>City: {weather.name}</div>
                        <div>Temperature: {weather.main.temp} °C</div>
                        <div>Description: {weather.weather[0].description}</div>
                    </div>
                )}
                {error && <div className="weather-error">Error: {error}</div>}
            </Box>
        </div>
    );
}
