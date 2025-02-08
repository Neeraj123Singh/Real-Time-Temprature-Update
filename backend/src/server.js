require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Temperature = require('./models/Temperature');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());


console.log(process.env)
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

io.on('connection', async (socket) => {
    console.log('Client connected');

    setInterval(async () => {
        try {
            // Step 1: Generate raw readings
            const temperature = Math.floor(Math.random() * 100);
            const status = temperature > 24 ? 'HIGH' : 'NORMAL';

            const rawReading = { temperature, status };

            // Step 2: Emit raw readings to frontend
          //  socket.emit('rawTemperatureUpdate', rawReading);

            // Step 3: Save raw readings to the database
            const newReading = new Temperature({ temperature, status, processed: false });
            await newReading.save();

            // Step 4: Process raw data in the backend
            const processedData = processTemperatureData(rawReading);

            // Step 5: Save processed data to the database
            const processedReading = new Temperature({
                temperature: processedData.temperature,
                status: processedData.status,
                processed: true,
                time: new Date(),
            });
            await processedReading.save();

            // Step 6: Emit processed data to the frontend
            socket.emit('temperatureUpdate', processedData);

        } catch (error) {
            console.error('Error processing data:', error);
        }
    }, 10000); // Generate and process data every 2 seconds
});

// Function to process raw readings
function processTemperatureData(rawReading) {
    const { temperature } = rawReading;
    let processedStatus = 'NORMAL';

    if (temperature >= 70) processedStatus = 'CRITICAL';
    else if (temperature > 50) processedStatus = 'HIGH';
    else if (temperature<=25)  processedStatus = 'LOW';

    return { temperature, status: processedStatus };
}

// Step 7: API for frontend to fetch raw & processed data
app.get('/api/temperature', async (req, res) => {
    try {
        const rawReadings = await Temperature.find({ processed: false });
        const processedReadings = await Temperature.find({ processed: true });
        res.json({ rawReadings, processedReadings });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch temperature data' });
    }
});

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

module.exports = { app, server };
