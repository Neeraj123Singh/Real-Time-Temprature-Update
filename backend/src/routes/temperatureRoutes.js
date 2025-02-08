const express = require('express');
const router = express.Router();
const { getTemperature } = require('../controllers/temperatureController');

router.get('/', getTemperature);

module.exports = router;
