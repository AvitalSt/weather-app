require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(404).json({ message: 'Password is not correct' });
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            token,
            user: {
                username: user.username,
                favoriteCities: user.favoriteCities,
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function registerUser(req, res) {
    try {
        const { username, password } = req.body;
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({
            username,
            password
        });
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });
        res.status(200).json({
            token,
            user: {
                username: user.username,
            }
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const nameError = error.errors?.username;
            const passwordError = error.errors?.password;
            if (nameError) {
                return res.status(400).json({ message: "Username must be at least 2 characters long." });
            }
            if (passwordError) {
                return res.status(400).json({ message: passwordError.message });
            }
        }
        res.status(500).json({ message: 'Server error', error });
    }

}
module.exports = { login, registerUser };
