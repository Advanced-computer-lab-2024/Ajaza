const Product = require("../models/Product");
const Tourist = require("../models/Tourist");
const Seller = require("../models/Seller");
const Admin = require("../models/Admin");

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

// Get all products req81
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({hidden: { $ne: true }/*, archived: { $ne: true },*/});
    if(!products || products.length === 0){
      //return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products including hidden
exports.getAllProductsEH = async (req, res) => {
  try {
    const products = await Product.find();
    if(!products || products.length === 0){
      //return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByIds = async (req, res) => {
  try {
    const { productIds } = req.body;
    const products = await Product.find({ _id: { $in: productIds } });
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
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
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
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req102 & req103 TESTED
exports.giveFeedback = async (req, res) => {
  const productId = req.params.productId;
  const touristId = req.params.touristId;
  const { rating, comments } = req.body;

  if (!rating || !comments) {
    return res
      .status(400)
      .json({ message: "Rating and comments are required." });
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "Rating must be a number between 1 and 5." });
  }

  try {
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const hasPurchased = tourist.orders.some((order) =>
      order.products.some(
        (product) =>
          product.productId.toString() === productId &&
          order.status !== "Cancelled"
      )
    );

    if (!hasPurchased) {
      return res.status(403).json({
        message: "You must purchase the product before giving feedback.",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $push: { feedback: { touristId, rating, comments } },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
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

  // Allowed fields
  const allowedFields = ["name", "photo","price", "desc", "quantity"];
  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach((field) => {
    // Loop through the allowed fields
    if (req.body[field] !== undefined) {
      // Check if the field exists in the request body
      filteredBody[field] = req.body[field]; // Add the field to the filtered body
    }
  });

  // Initialize flags
  let isSeller = false;
  let isAdmin = false;
  const id = req.params.id;
  try {
    // Check if the ID is a seller ID
    const seller = await Seller.findById(id);
    if (seller) {
      if(seller.requestingDeletion){
        return res.status(403).json({ error: "Seller is requesting deletion" });
      }
      if(seller.pending){
        return res.status(403).json({ error: "Seller is pending approval" });
      }
      if(seller.acceptedTerms === false){
        return res.status(403).json({ error: "Seller has not accepted the terms" });
      }

      isSeller = true;
      // If the ID is a seller ID, add the sellerId and sellerName to the product
      filteredBody.sellerId = id;
      filteredBody.sellerName = seller.username;
    } else {
      // If not a seller, check if the ID is an admin ID
      const admin = await Admin.findById(id);
      if (admin) {
        isAdmin = true;
        // If the ID is an admin ID, add the adminId to the product
        filteredBody.adminId = id;
      }
    }

    // If the ID is neither a seller nor an admin, return an error
    if (!isSeller && !isAdmin) {
      return res.status(404).json({ error: "ID entered is invalid" });
    }

    // Create and save the product
    try {
      const product = new Product(filteredBody);
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//view my products
exports.viewMyProducts = async (req, res) => {
  try {
    const id = req.params.id;

    let isSeller = false;
    let isAdmin = false;

    // Check if the ID is a seller ID
    const seller = await Seller.findById(id);
    if (seller) {
      isSeller = true;
      if(seller.pending){
        return res.status(403).json({ error: "Seller is pending approval" });
      }
      if(seller.acceptedTerms === false){
        return res.status(403).json({ error: "Seller has not accepted the terms" });
      }
    } else {
      // If not a seller, check if the ID is an admin ID
      const admin = await Admin.findById(id);
      if (admin) {
        isAdmin = true;
      }
    }

    // If the ID is neither a seller nor an admin, return an error
    if (!isSeller && !isAdmin) {
      return res.status(404).json({ error: "ID entered is invalid" });
    }

    if(isSeller){
      const products = await Product.find({sellerId: id, hidden: { $ne: true }/*, archived: { $ne: true },*/});
      if(!products || products.length === 0){
        //return res.status(404).json({ message: "No products found" });
      }
      res.status(200).json(products);
    } else {
      const products = await Product.find({adminId: id, hidden: { $ne: true }/*, archived: { $ne: true },*/});
      if(!products || products.length === 0){
        //return res.status(404).json({ message: "No products found" });
      }
      res.status(200).json(products);
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//req. 88
// Admin/Seller Edit a product in the system

exports.adminSellerEditProduct = async (req, res) => {
  //TODO: input validations (check ta7t el awel ashan enta 3amel a8labhom)
  const id = req.params.id;
  const productId = req.params.productId;

  // Log the IDs for debugging
  console.log(`Received ID: ${id}`);
  console.log(`Received Product ID: ${productId}`);

  // Initialize flags
  let isSeller = false;
  let isAdmin = false;

  try {
    // Check if the ID is a seller ID
    const seller = await Seller.findById(id);
    if (seller) {
      isSeller = true;
      if(seller.pending){
        return res.status(403).json({ error: "Seller is pending approval" });
      }
      if(seller.acceptedTerms === false){
        return res.status(403).json({ error: "Seller has not accepted the terms" });
      }
    } else {
      // If not a seller, check if the ID is an admin ID
      const admin = await Admin.findById(id);
      if (admin) {
        isAdmin = true;
      }
    }

    // If the ID is neither a seller nor an admin, return an error
    if (!isSeller && !isAdmin) {
      return res.status(404).json({ error: "ID entered is invalid" });
    }

    // Check if the product ID is valid
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If the user is a seller, check if the product has a sellerId then check if it matches the provided sellerId
    if (isSeller) {
      if (product.sellerId) {
        if (product.sellerId.toString() !== id) {
          return res.status(403).json({
            error:
              "Seller ID entered cannot update this product (Product belongs to another Seller)",
          });
        }
      } else {
        //product doesn't belong to a seller
        return res.status(403).json({
          error:
            "Seller ID entered cannot update this product (Product belongs to the Admin)",
        });
      }
    }

    // Define allowed fields in the request body
    const allowedFields = ["name", "photo", "price", "desc", "quantity"];

    // Filter the request body
    const filteredBody = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        filteredBody[field] = req.body[field];
      }
    });

    // Update the product
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        filteredBody,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//search for products by name
exports.searchProduct = async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.query.name, $options: "i" },
      hidden: { $ne: true },
      /*archived: { $ne: true },*/
    });
    if (products.length === 0) {
      //return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//req. 89
// Admin/Seller Archive/Unarchive a product in the system

exports.adminSellerArchiveProduct = async (req, res) => {
  //TODO: input validations (check ta7t el awel ashan enta 3amel a8labhom)
  const id = req.params.id;
  const productId = req.params.productId;
  const archive = req.body.archived; // Direct access without conversion


  // // Log the IDs for debugging
  // console.log(`Received ID: ${id}`);
  // console.log(`Received Product ID: ${productId}`);
  // console.log(`Request body archive value: ${archive}`);
  // console.log(`Type of request body archive value: ${typeof archive}`);

  // Initialize flags
  let isSeller = false;
  let isAdmin = false;

  try {
    // Check if the ID is a seller ID
    const seller = await Seller.findById(id);
    if (seller) {
      isSeller = true;
      if (seller.pending) {
        return res.status(403).json({ error: "Seller is pending approval" });
      }
      if (seller.acceptedTerms === false) {
        return res.status(403).json({ error: "Seller has not accepted the terms" });
      }
    } else {
      // If not a seller, check if the ID is an admin ID
      const admin = await Admin.findById(id);
      if (admin) {
        isAdmin = true;
      }
    }

    // If the ID is neither a seller nor an admin, return an error
    if (!isSeller && !isAdmin) {
      return res.status(404).json({ error: "ID entered is invalid" });
    }

    // Check if the product ID is valid
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If the user is a seller, check if the product has a sellerId then check if it matches the provided sellerId
    if (isSeller) {
      if (product.sellerId) {
        if (product.sellerId.toString() !== id) {
          return res.status(403).json({
            error: "Seller ID entered cannot update this product (Product belongs to another Seller)",
          });
        }
      } else {
        //product doesn't belong to a seller
        return res.status(403).json({
          error: "Seller ID entered cannot update this product (Product belongs to the Admin)",
        });
      }
    }

    // // Check if the product is already archived and the request body has archive set to true
    // console.log(`Product archived status: ${product.archived}`);
    // console.log(`Request body archive value: ${archive}`);

    if (product.archived && archive === true) {
      return res.status(400).json({ error: "Product is already archived" });
    }

    // Check if the product is not archived and the request body has archive set to false
    if (!product.archived && archive === false) {
      return res.status(400).json({ error: "Product is already unarchived" });
    }

    // Define allowed fields in the request body
    const allowedFields = ["archived"];

    // Filter the request body
    const filteredBody = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        filteredBody[field] = req.body[field];
      }
    });

    // Update the product --> archived/unarchived
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, filteredBody, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};