const express = require('express');
const mongoose = require('mongoose');
const { PORT, mongoDBURL } = require('./config.js');
mongoose.set('strictQuery', false);
const { createGuide, getGuideProfile, updateGuideProfile } = require('./controllers/guideProfileController'); // Import the functions from the controller
// Load environment variables
require('dotenv').config();

const guideRoutes = require('./routes/guideProfileRoutes.js'); // Import the routes

const app = express();
const port = process.env.PORT || PORT; // Fallback to the `PORT` imported from config
const mongo_URL = process.env.mongoDBURL || mongoDBURL; // Fallback to the `mongoDBURL` imported from config

app.use(express.json());

// Basic route to test server
app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).send('Welcome to the website');
});


// Use the imported guide profile routes
app.use('/api/guides', guideRoutes); // This line connects your routes

// Connect to MongoDB and start the server
mongoose
    .connect(mongo_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log('App is listening on port:', port);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Define routes directly using imported functions
/*
app.post('/addGuide', createGuide);
app.get('/getGuideProfile', getGuideProfile);
app.put('/updateGuideProfile', updateGuideProfile);
*/