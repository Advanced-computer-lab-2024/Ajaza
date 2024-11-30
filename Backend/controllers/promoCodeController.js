const PromoCode = require('../models/PromoCode');
const Tourist = require('../models/Tourist');


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

exports.checkValid = async (req,res) => {
  try {
    const code = req.params.code;

    if(!code) {
      return res.status(404).json({message:"Missing code"});
    }

    const promo = await PromoCode.findOne({code});

    if(!promo) {
      return res.status(404).json({message: "Promocode not found"});
    }
    if(promo.birthday.touristIds.length === 0) {
      return res.status(200).json({value: promo.value});
    } else {

      const touristId = req.body.touristId;

      if(!touristId) {
        return res.status(404).json({message:"Tourist ID needed"});
      }

      if(promo.birthday.touristIds.includes(touristId)) {
        return res.status(200).json({value: 0.8});
      } else {
        return res.status(404).json({message:"Tourist not eligible"});
      }
    }

  } catch(error) {
    console.log(error);
    res.status(500).json({message:"Internal error"});
  }
}

// Admin create a promo code
exports.createPromoAdmin = async (req, res) => {
  try {
    const { code, value } = req.body;

    if (!code || !value) {
      return res.status(400).json({ message: 'Code and value are required' });
    }

    const promoCode = new PromoCode({
      code,
      value,
    });

    const savedPromoCode = await promoCode.save();
    res.status(201).json(savedPromoCode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
