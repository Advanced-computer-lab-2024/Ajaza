const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');


// req23 CREATE TESTED
router.post('/', categoryController.createCategory);
/* passes: category: String,

   returns: {
    category: String,
   }
*/

// req23 READ TESTED
router.get('/', categoryController.getAllCategories);
/* passes: nothing,

   returns: [{
    category: String,
    }]
*/

// req23 UPDATE TESTED
router.patch('/:id', categoryController.updateCategory);
/* passes: id: ObjectId from params,
            category: String,

   returns: {
    category: String,
   }
*/

// req23 DELETE TESTED
router.delete('/:id', categoryController.deleteCategory);
/* passes: id: ObjectId from params,

   returns: {
    message: String,
   }
*/

// this will probably not be used
router.get('/:id', categoryController.getCategoryById);


module.exports = router;
