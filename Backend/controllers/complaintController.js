const Complaint = require('../models/Complaint');
const Tourist = require('../models/Tourist');


// Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    const savedComplaint = await complaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('touristId');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('touristId');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update complaint by ID (for resolving or editing)
exports.updateComplaint = async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete complaint by ID
exports.deleteComplaint = async (req, res) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!deletedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req80 TESTED
exports.getTouristComplaints = async (req, res) => {
  const touristId = req.params.touristId;

  try {
    const complaints = await Complaint.find({ touristId });

    if (complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found for this tourist.' });
    }

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req73 TESTED
exports.fileComplaint = async (req, res) => {
  const { title, body } = req.body;
  const touristId = req.params.id;

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required.' });
  }

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    const newComplaint = new Complaint({
      touristId,
      title,
      body,
    });

    // insert line
    await newComplaint.save();

    res.status(201).json({ message: 'Complaint filed successfully.', complaint: newComplaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};