const axios = require('axios');
const User = require('../models/user');
const { getWeatherByCity, addFavoriteCity, getAllFavoriteCities } = require('../controllers/weatherController');
const apiKey = process.env.JWT_SECRET;

jest.mock('axios');

jest.mock('../models/user', () => ({
    findById: jest.fn()
}));

describe('getWeatherByCity', () => {
    it('should return weather data for a valid city', async () => {
        axios.get.mockResolvedValue({
            data: {
                main: { temp: 22 },
                weather: [{ description: 'clear sky' }]
            }
        });
        const req = { params: { city: 'Tel Aviv' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await getWeatherByCity(req, res);
        expect(axios.get).toHaveBeenCalledWith(
            `http://api.openweathermap.org/data/2.5/weather?q=Tel Aviv&appid=${apiKey}&units=metric`
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            main: { temp: 22 },
            weather: [{ description: 'clear sky' }]
        });
    });

    it('should return 500 if API call fails', async () => {
        axios.get.mockRejectedValue(new Error('API call failed'));
        const req = { params: { city: 'Tel Aviv' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await getWeatherByCity(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Error fetching weather data',
            message: 'API call failed'
        });
    })
})

describe('addFavoriteCity', () => {

    it('should return 404 if user not found', async () => {
        User.findById.mockResolvedValue(null);
        const req = { user: { id: '123' }, body: { city: 'Tel Aviv' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await addFavoriteCity(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    })

    it('should return 400 if city already in favorites', async () => {
        const user = {
            favoriteCities: ['Tel Aviv'],
            save: jest.fn()
        };
        User.findById.mockResolvedValue(user);
        const req = { user: { id: '123' }, body: { city: 'Tel Aviv' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await addFavoriteCity(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'City already in favorites' });

    });

    it('should add a city to the favorites if the city is not already in the list', async () => {
        const user = {
            favoriteCities: [],
            save: jest.fn()
        };
        User.findById.mockResolvedValue(user);
        const req = { user: { id: '123' }, body: { city: 'Tel Aviv' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await addFavoriteCity(req, res);

        expect(user.favoriteCities).toContain('Tel Aviv');
        expect(user.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Tel Aviv added to favorites' });
    });

    it('should return 500 if a server error occurs', async () => {
        User.findById.mockRejectedValue(new Error('Database error'));
        const req = { user: { id: '123' }, body: { city: 'Tel Aviv' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await addFavoriteCity(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error', error: 'Database error' });
    })
});

describe('getAllFavoriteCities', () => {

    it('should return 404 if user not found', async () => {
        User.findById.mockResolvedValue(null);
        const req = { user: { id: '123' }, body: { city: 'Tel Aviv' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await getAllFavoriteCities(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return favorites cities', async () => {
        const user = {
            favoriteCities: ["Tel Aviv, Beni Brak"],
            save: jest.fn()
        };
        User.findById.mockResolvedValue(user);
        const req = { user: { id: '123' }, body: { city: 'Tel Aviv' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await getAllFavoriteCities(req, res);
        expect(user.favoriteCities).toContain("Tel Aviv, Beni Brak");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ "favoriteCities": ["Tel Aviv, Beni Brak"] });
    });

    it('should return 500 if a server error occurs', async () => {
        User.findById.mockRejectedValue(new Error('Database error'));
        const req = { user: { id: '123' }, body: { city: 'Tel Aviv' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await getAllFavoriteCities(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error', error: 'Database error' });
    })
})