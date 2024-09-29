const Product = require('../models/Product');
const Tourist = require('../models/Tourist');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');


// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req102 & req103 TESTED
exports.giveFeedback = async (req, res) => {
  const productId = req.params.productId;
  const touristId = req.params.touristId;
  const { rating, comments } = req.body;

  if(!rating || !comments) {
    return res.status(400).json({ message: 'Rating and comments are required.' });
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
  }

  try {
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const hasPurchased = tourist.orders.some(order =>
      order.products.some(product => product.productId.toString() === productId && order.status !== 'Cancelled')
    );

    if (!hasPurchased) {
      return res.status(403).json({ message: 'You must purchase the product before giving feedback.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $push: { feedback: { rating, comments } }
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




        //req. 86
// Admin/Seller add a product to the system
exports.adminSellerAddProduct = async (req, res) => {
  
  // TODO: validation of the input data

  //TODO: Check if the user is an admin or a seller and add sellerId or adminId to the product + sellerName if applicable (username)

  // Allowed fields
  const allowedFields = ['name', 'photo', 'price','desc', 'quantity'];
  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach(field => { // Loop through the allowed fields
    if (req.body[field] !== undefined) { // Check if the field exists in the request body
      filteredBody[field] = req.body[field]; // Add the field to the filtered body
    }
  });
  try {
    const product = new Product(filteredBody);
    const savedproduct = await product.save();
    res.status(201).json(savedproduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




        //req. 88
// Admin/Seller Edit a product in the system

exports.adminSellerEditProduct = async (req, res) => {

  // Define allowed fields in the request body
const allowedFields = ['name', 'photo', 'price', 'desc', 'quantity'];

// Filter the request body
const filteredBody = {};
allowedFields.forEach(field => {
  if (req.body[field] !== undefined) {
    filteredBody[field] = req.body[field];
  }
});

try {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, filteredBody, { new: true });
  if (!updatedProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json(updatedProduct);
} catch (error) {
  res.status(500).json({ error: error.message });
}
};