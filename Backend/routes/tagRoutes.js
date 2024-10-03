const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

// I think there will no longer be a collection named tags

// req24 CREATE
router.post('/', tagController.createTag);

// req24 READ
router.get('/', tagController.getAllTags);

// will not be used
router.get('/:id', tagController.getTagById);

// req24 UPDATE
router.patch('/:id', tagController.updateTag);

// req24 DELETE
router.delete('/:id', tagController.deleteTag);

module.exports = router;
