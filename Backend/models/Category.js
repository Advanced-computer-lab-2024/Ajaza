const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true }, // Unique category name
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Admin who created the category
});

// Create the model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
