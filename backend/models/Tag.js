const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  tag: { type: String, required: true, unique: true }, // Unique tag name
});

// Create the model
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
