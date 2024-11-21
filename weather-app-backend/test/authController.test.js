const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { login, registerUser } = require('../controllers/authController');

jest.mock('../models/user', () => ({
    findOne: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

describe('login', () => {
    it('should return 404 if user not found', async () => {
        User.findOne.mockResolvedValue(null);
        const req = { body: { username: 'avi', password: '@Aa12345' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn() 
        };
        await login(req, res);
        expect(User.findOne).toHaveBeenCalledWith({ username: 'avi' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 404 if password not correct', async () => {
        const mockUser = {
            matchPassword: jest.fn().mockResolvedValue(false)
        };
        User.findOne.mockResolvedValue(mockUser);
        const req = { body: { username: 'avi', password: '@Aa12345' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()  
        };
        await login(req, res);
        expect(mockUser.matchPassword).toHaveBeenCalledWith('@Aa12345');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password is not correct' });
    });

    it('should return 200 and token for successful login', async () => {
        const mockUser = {
            _id: '12345',  
            username: 'avi',
            favoriteCities: ['Tel Aviv', 'New York'],
            matchPassword: jest.fn().mockResolvedValue(true)
        };
        User.findOne.mockResolvedValue(mockUser);        
        jwt.sign.mockReturnValue('mockToken');
        const req = { body: { username: 'avi', password: '@Aa12345' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()  
        };
        await login(req, res);
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: '12345' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            token: 'mockToken',
            user: {
                username: 'avi',  
                favoriteCities: ['Tel Aviv', 'New York']
            }
        });
    });

    it('should return 500 if a server error occurs', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));
        const req = { body: { username: 'avi', password: '@Aa12345' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn() 
        };
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Server error',
            error: 'Database error'
        });
    });
});

describe('registerUser', () => {
    it('should return 400 if user already exists',async()=>{
        User.findOne.mockResolvedValue({ username: 'avi' }); 
        const req = { body: { username: 'avi', password: '@Aa12345' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await registerUser(req, res);
        expect(User.findOne).toHaveBeenCalledWith({ username: 'avi' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('should return 200 and token for successful registration', async () => {
        User.findOne.mockResolvedValue(null); 
        User.create = jest.fn().mockResolvedValue({
            _id: '12345',
            username: 'avi',
            password: '@Aa12345'
        });
        jwt.sign.mockReturnValue('mockToken');
        const req = { body: { username: 'avi', password: '@Aa12345' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await registerUser(req, res);
        expect(User.findOne).toHaveBeenCalledWith({ username: 'avi' });
        expect(User.create).toHaveBeenCalledWith({
            username: 'avi',
            password: '@Aa12345'
        });
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: '12345' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            token: 'mockToken',
            user: {
                username: 'avi',
            }
        });
    });

    it('should return 400 for validation errors in username', async () => {
        const validationError = {
            name: 'ValidationError',
            errors: {
                username: { message: 'Username must be at least 2 characters long.' }
            }
        };
        User.findOne.mockResolvedValue(null); 
        User.create = jest.fn().mockRejectedValue(validationError);
        const req = { body: { username: 'a', password: '@Aa12345' } }; 
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await registerUser(req, res);
        expect(User.create).toHaveBeenCalledWith({
            username: 'a',
            password: '@Aa12345'
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Username must be at least 2 characters long.'
        });
    });

    it('should return 400 for validation errors in password', async () => {
        const validationError = {
            name: 'ValidationError',
            errors: {
                password: { message: 'Password must be at least 6 characters long.' }
            }
        };
        User.findOne.mockResolvedValue(null);
        User.create = jest.fn().mockRejectedValue(validationError);
        const req = { body: { username: 'avi', password: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await registerUser(req, res);
        expect(User.create).toHaveBeenCalledWith({
            username: 'avi',
            password: '123'
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Password must be at least 6 characters long.'
        });
    });

    it('should return 500 if a server error occurs', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));
        const req = { body: { username: 'avi', password: '@Aa12345' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Server error',
            error: expect.any(Error) 
        });
    });
});

