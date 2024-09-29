const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/', adminController.createAdmin);

// this will probably not be used
router.get('/', adminController.getAllAdmins);

// probably used when product is out of stock (to send notification to admin who posted product)
router.get('/:id', adminController.getAdminById);

// for update password
router.patch('/:id', adminController.updateAdmin);

// this will probably be commented for security reasons
router.delete('/:id', adminController.deleteAdmin);



module.exports = router;
