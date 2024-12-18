const express = require('express');
const router = express.Router();
const weatherController = require("../controllers/weatherController")
const { authenticateToken } = require("../middleware/authMiddleware");

router.get('/getWeatherByCity/:city', weatherController.getWeatherByCity);
router.post('/add', authenticateToken, weatherController.addFavoriteCity);
router.get('/getAllFavoriteCities', authenticateToken, weatherController.getAllFavoriteCities)

module.exports = router;

