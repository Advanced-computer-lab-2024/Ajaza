const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true }, // Unique category name
});

// Create the model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
