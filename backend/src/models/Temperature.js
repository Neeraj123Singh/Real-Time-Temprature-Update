const mongoose = require('mongoose');

const TemperatureSchema = new mongoose.Schema({
    temperature: { type: Number, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Temperature', TemperatureSchema);
