const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

// I think there will no longer be a collection named tags

router.post('/', tagController.createTag);

router.get('/', tagController.getAllTags);

router.get('/:id', tagController.getTagById);

router.patch('/:id', tagController.updateTag);

router.delete('/:id', tagController.deleteTag);

module.exports = router;
