const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the product
  photo: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Img'}, // Path or URL of the product image
  price: { type: Number, required: true }, // Price of the product
  desc: { type: String, required: true }, // Description of the product
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }, // Reference to the seller
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Reference to the admin (if applicable)
  sellerName: { type: String, default: "Ajaza"}, // Name of the seller (if applicable)
  quantity: { type: Number, required: true, default: 0 }, // Available quantity of the product
  sales: { type: Number, default: 0 }, // Total sales count
  feedback: [
    {
      rating: { type: Number, min: 1, max: 5,required: false }, // Rating between 1 and 5
      comments: { type: String,required: false },
    },
  ],
  archived: { type: Boolean, default: false }, // Indicates if the product is archived
});

// Create the model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
