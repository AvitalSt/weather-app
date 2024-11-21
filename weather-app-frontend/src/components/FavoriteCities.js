import React, { useState, useEffect } from 'react';
import { getAllFavoriteCities, getWeatherByCity  } from '../services/weatherService';
import { useNavigate } from 'react-router-dom';
import './weather.css';
import HomeButton from './HomeButton'

export default function FavoriteCities() {
    const [favoriteCities, setFavoriteCities] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchgetAllFavoriteCities();
    }, []);

    const fetchgetAllFavoriteCities = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setError(null);
                const data = await getAllFavoriteCities();
                setFavoriteCities(data.favoriteCities);
                data.favoriteCities.forEach((city) => {
                    fetchWeather(city);
                });
            } catch (err) {
                setError(err.message);
            }
        } else {
            navigate('/login');
        }
    };

    const fetchWeather = async (city) => {
        try {
            const data = await getWeatherByCity(city);     
            setWeatherData((prevData) => ({
                ...prevData,
                [city]: data,          
            }));
        } catch (err) {
            console.error("Error fetching weather data:", err);
        }
    };

    return (
        <div className="favorite-cities-container">
            <div className="favorite-cities-box">
                <h2 className="favorite-cities-title">Your Favorite Cities</h2>
                {error && <div className="favorite-cities-error">Error: {error}</div>}
                {favoriteCities.length > 0 ? (
                    <ul className="favorite-cities-list">
                        {favoriteCities.map((city, index) => (
                            <li key={index}>
                                {city}
                                {weatherData[city] ? (
                                    <span> - {weatherData[city].main.temp}°C - {weatherData[city].weather[0].description}</span>
                                ) : (
                                    <span> - Loading...</span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="favorite-cities-message">No favorite cities yet.</div>
                )}
            </div>
            <HomeButton />
        </div>
    );
}
