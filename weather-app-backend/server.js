require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

const { sendDailyWeatherEmails } = require('./controllers/weatherController');
const weatherRouter = require('./routes/weatherRouter')
const authRouter = require('./routes/authRoutes');

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

cron.schedule('39 11 * * *', () => {
    console.log('Automatic email sending...');
    sendDailyWeatherEmails();
});

const app = express();

app.use(cors());
app.use(express.json());

app.use('/weather', weatherRouter)
app.use('/', authRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
