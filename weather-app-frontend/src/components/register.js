import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton'
import './loginRegister.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await register(username, password);
            localStorage.setItem('token', data.token);
            alert('Register successful!');
            navigate('/')
        } catch (error) {
            setError(error.response.data.message);
        }
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
                {error && <div className="error-message">{error}</div>}
                <Button variant="contained" fullWidth className="auth-button" onClick={handleSubmit}>Register</Button>
            </Box>
            <HomeButton />
        </div>
    )
}
