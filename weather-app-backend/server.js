require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

const weatherRouter=require('./routes/weatherRouter')
const authRouter=require('./routes/authRoutes');

mongoose.connect(DB_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

app.use(cors());
app.use(express.json());
app.use('/weather',weatherRouter)
app.use('/',authRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
