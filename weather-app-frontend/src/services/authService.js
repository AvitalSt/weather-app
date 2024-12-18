import axios from 'axios';

export async function login(username, password) {
    try {
        const response = await axios.post(`http://localhost:3000/login`, { username, password });
        return response.data;
    } catch (err) {
        throw new Error('Login failed');
    }
};

export async function register({ username, password, email, city }) {
    try {
        const response = await axios.post(`http://localhost:3000/register`, { username, password, email, city });
        return response.data;
    } catch (err) {
        throw err;
    }
};