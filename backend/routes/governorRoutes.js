const express = require('express');
const router = express.Router();
const governorController = require('../controllers/governorController');

router.post('/', governorController.createGovernor);

router.get('/', governorController.getAllGovernors);

router.get('/:id', governorController.getGovernorById);

// used in forgot password
router.patch('/:id', governorController.updateGovernor);

router.delete('/:id', governorController.deleteGovernor);

module.exports = router;
