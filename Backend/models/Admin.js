const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true}, //made unique fro req 17 ng
  pass: { type: String, required: true }, // hashed password
  notifications: [
    {
      text: { type: String},//shelt required
      seen: { type: Boolean, default: false },
      productId: { type: Number }, // optional field for product-related notifications
    },
  ],
});

// Create the model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
