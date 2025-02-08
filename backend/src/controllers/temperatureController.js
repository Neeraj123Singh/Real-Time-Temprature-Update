const Temperature = require('../models/Temperature');

exports.getTemperature = async (req, res) => {
    try {
        const readings = await Temperature.find().sort({ timestamp: -1 }).limit(5);
        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
