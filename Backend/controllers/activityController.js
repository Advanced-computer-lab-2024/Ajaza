const Activity = require('../models/Activity');
const Tourist = require('../models/Tourist');

// Create a new activity
exports.createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all activities
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get activity by ID
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update activity by ID
exports.updateActivity = async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete activity by ID
exports.deleteActivity = async (req, res) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req37 TESTED
exports.searchByNameCategoryTag = async (req, res) => {
  //authentication middleware

  const searchString = req.body.searchString || '';

  if (!searchString) {
    return res.status(400).json({ message: 'Search string is required' });
  }

  try {
    const activities = await Activity.find({
      $or: [
        { name: { $regex: searchString, $options: 'i' } },
        { category: { $elemMatch: { $regex: searchString, $options: 'i' } } },
        { tags: { $elemMatch: { $regex: searchString, $options: 'i' } } }
      ]
    });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req56 & req57
exports.giveActivityFeedback = async (req, res) => {
  try {
    const { touristId, activityId } = req.params;
    const { rating, comments } = req.body;

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const activityBooking = tourist.activityBookings.find(
      booking => booking.activityId.toString() === activityId
    );

    if (!activityBooking) {
      return res.status(400).json({ message: 'No valid past activity booking found' });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    if(activity.date > new Date()) {
      return res.status(400).json({ message: 'No valid past activity booking found' });
    }

    // append the feedback to the activity
    activity.feedback.push({ rating, comments});

    await activity.save();

    res.status(200).json({ message: 'Feedback submitted successfully', feedback: activity.feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
