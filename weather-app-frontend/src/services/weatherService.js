import axios from 'axios';

export async function getWeatherByCity(city){
    try {
        const response = await axios.get(`http://localhost:3000/weather/getWeatherByCity/${city}`);
        return response.data;
    } catch (err) {
        throw new Error('City not found');
    }
};

export async function addCityToFavorites(city) {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.post('http://localhost:3000/weather/add', { city }, { headers });
        return response.data;
    } catch (err) {
        throw err.response.data;
    }
}

export async function getAllFavoriteCities() {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.get('http://localhost:3000/weather/getAllFavoriteCities', { headers });
        return response.data;
    } catch (err) {
        throw err.response.data;
    }
}


