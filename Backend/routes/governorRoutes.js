const express = require('express');
const router = express.Router();
const governorController = require('../controllers/governorController');

router.post('/createAgain' , governorController.createGovernor)

router.get('/', governorController.getAllGovernors);

router.get('/:id', governorController.getGovernorById);

// used in forgot password
router.patch('/:id', governorController.updateGovernor);

router.delete('/:id', governorController.deleteGovernor);

// req 17 ng
router.post('/addGoverner', governorController.adminAddGovernor);


module.exports = router;
