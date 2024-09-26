const PromoCode = require('../models/PromoCode');

// Create a new promo code
exports.createPromoCode = async (req, res) => {
  try {
    const promoCode = new PromoCode(req.body);
    const savedPromoCode = await promoCode.save();
    res.status(201).json(savedPromoCode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all promo codes
exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get promo code by ID
exports.getPromoCodeById = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    res.status(200).json(promoCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update promo code by ID
exports.updatePromoCode = async (req, res) => {
  try {
    const updatedPromoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPromoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    res.status(200).json(updatedPromoCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete promo code by ID
exports.deletePromoCode = async (req, res) => {
  try {
    const deletedPromoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!deletedPromoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    res.status(200).json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
