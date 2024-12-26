import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { register } from '../services/authService';
import { getWeatherByCity, addCityToFavorites } from '../services/weatherService';
import { useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton'
import './loginRegister.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await getWeatherByCity(city);
            const data = await register({ username, password, email, city });
            localStorage.setItem('token', data.token);
            const user = { city };
            localStorage.setItem('user', JSON.stringify(user));
            await addCityToFavorites(city);
            alert('Register successful!');
            navigate('/')
        } catch (error) {
            if (error.message === 'City not found') {
                setError('The city was not found. Please check the city name and try again.');
            }
            else {
                setError(error.response.data.message);
            }
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <Box
                component="form"
                className="auth-box"
                noValidate
                autoComplete="off"
            >
                <h2 className="auth-title">Register</h2>
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    className="auth-input"
                />
                <TextField
                    id="password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    className="auth-input"
                />
                <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    className="auth-input"
                />
                <TextField
                    id="city"
                    label="City"
                    variant="outlined"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    fullWidth
                    className="auth-input"
                />
                {error && <div className="error-message">{error}</div>}
                <Button variant="contained" fullWidth className="auth-button" onClick={handleSubmit}>Register</Button>
                <Button variant="outlined" fullWidth className="auth-button-back" onClick={handleLogin}>Back to Login</Button>

            </Box>
            <HomeButton />
        </div>
    )
}
