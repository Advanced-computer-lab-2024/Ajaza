const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

router.post('/', complaintController.createComplaint);

router.get('/', complaintController.getAllComplaints);

router.get('/:id', complaintController.getComplaintById);

// (mark as resolved)
router.patch('/:id', complaintController.updateComplaint);

// this will probably not be used
router.delete('/:id', complaintController.deleteComplaint);

// req80
router.get('/myComplaints/:touristId', complaintController.getTouristComplaints);

// req73
router.post('/fileComplaint/:id', complaintController.fileComplaint);

//req 76
router.put('/resolve/:id', complaintController.resolveComplaint);


module.exports = router;
