const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/', categoryController.createCategory);

router.get('/', categoryController.getAllCategories);

// this will probably not be used
router.get('/:id', categoryController.getCategoryById);

// this will probably not be used
router.patch('/:id', categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
