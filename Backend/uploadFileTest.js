const express = require('express');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const uploadImage = require('../middleware/uploadImage'); // Adjust path if necessary
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.ATLAS_URI;
if (!uri) {
  console.error(
    "MongoDB connection URI is not defined. Please set ATLAS_URI in your .env file."
  );
  process.exit(1);
}

mongoose.connect(uri);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Route to create an admin with an image
app.post('/admin', uploadImage, async (req, res) => {
  try {
    const { username, pass } = req.body; // Assuming you're sending username and password

    const newAdmin = new Admin({
      username,
      pass, // Ensure you're hashing this before saving
      img: req.imgId, // Set the uploaded image ID
    });

    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
