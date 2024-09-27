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

// req80 NOT TESTED
router.get('/:touristId', getTouristComplaints);

// req73 NOT TESTED
router.post('/fileComplaint/:id', complaintController.fileComplaint);

module.exports = router;
