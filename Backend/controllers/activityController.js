const Activity = require("../models/Activity");
const Advertiser = require("../models/Advertiser");
const Tourist = require("../models/Tourist");
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
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get group of activities by ID
exports.getActivitiesByIds = async (req, res) => {
  try {
    const { activityIds } = req.body;
    const activities = await Activity.find({ _id: { $in: activityIds } });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update activity by ID
exports.updateActivity = async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
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
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req37 TESTED
exports.searchByNameCategoryTag = async (req, res) => {
  //authentication middleware

  const searchString = req.body.searchString || "";

  if (!searchString) {
    return res.status(400).json({ message: "Search string is required" });
  }

  try {
    const activities = await Activity.find({
      $or: [
        { name: { $regex: searchString, $options: "i" } },
        { category: { $elemMatch: { $regex: searchString, $options: "i" } } },
        { tags: { $elemMatch: { $regex: searchString, $options: "i" } } },
      ],
    });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req56 & req57 TESTED
exports.giveActivityFeedback = async (req, res) => {
  try {
    const { touristId, activityId } = req.params;
    const { rating, comments } = req.body;

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (tourist.gaveFeedback.includes(activityId)) {
      return res.status(400).json({ message: "Feedback already given" });
    }

    const activityBooking = tourist.activityBookings.find(
      (booking) => booking.activityId.toString() === activityId
    );

    if (!activityBooking) {
      return res
        .status(400)
        .json({ message: "No valid past activity booking found" });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    if (activity.date > new Date()) {
      return res
        .status(400)
        .json({ message: "No valid past activity booking found" });
    }

    // append the feedback to the activity
    activity.feedback.push({ rating, comments });
    tourist.gaveFeedback.push(activityId);
    await tourist.save();

    await activity.save();

    res.status(200).json({
      message: "Feedback submitted successfully",
      feedback: activity.feedback,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req42 TESTED
exports.getTransportation = async (req, res) => {
  //authentication middleware

  try {
    const { from, to } = req.body;

    let query = {
      "transportation.from": { $ne: null },
      "transportation.to": { $ne: null },
    };

    if (from) {
      query["transportation.from"] = from;
    }

    if (to) {
      query["transportation.to"] = to;
    }

    const activities = await Activity.find(query);

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//needed for req42
exports.createTransportation = async (req, res) => {
  const advertiserId = req.params.id;

  const advertiser = await Advertiser.findById(advertiserId);
  if (!advertiser) {
    return res.status(404).json({ message: "Advertiser not found" });
  }

  const {
    transportation,
    date,
    location,
    upper,
    lower,
    category,
    tags,
    discounts,
    spots,
  } = req.body;

  const name = "Transportation";

  try {
    const newActivity = new Activity({
      advertiserId,
      name,
      date,
      location,
      upper,
      lower,
      category,
      tags,
      discounts,
      spots,
      transportation,
    });

    const savedActivity = await newActivity.save();

    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// -- req 19 ---
exports.createSpecifiedActivity = async (req, res) => {
  try {
    const {
      advertiserId,
      name,
      date,
      upper,
      lower,
      location,
      price,
      category,
      tags,
      discounts,
      isOpen,
      spots,
    } = req.body;

    // Create a new activity
    const newActivity = new Activity({
      advertiserId,
      name,
      date,
      location,
      upper,
      lower,
      price,
      category,
      tags,
      discounts,
      isOpen,
      spots,
      hidden: false,
    });

    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.readActivitiesOfAdvertiser = async (req, res) => {
  try {
    const { advertiserId } = req.params; // Get advertiserId from the URL

    const activities = await Activity.find({ advertiserId, hidden: false });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteSpecificActivity = async (req, res) => {
  try {
    const activityId = req.params.id;

    // Check if the activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Fetch all tourists
    const tourists = await Tourist.find();

    // Check if any tourist has a booking for this activity
    for (const tourist of tourists) {
      const hasBooking = tourist.activityBookings.some(
        (booking) => booking.activityId.toString() === activityId
      );

      if (hasBooking) {
        return res.status(400).json({
          message: "Cannot delete activity; there are existing bookings.",
        });
      }
    }

    // If no bookings exist, hide the activity
    activity.hidden = true;
    await activity.save();

    res.status(200).json({ message: "Activity is now removed." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//req 44
exports.getUpcomingActivities = async (req, res) => {
  try {
    const currentDate = new Date();
    console.log("Current Date:", currentDate); // Log the current date
    const upcomingActivities = await Activity.find({
      date: { $gte: currentDate },
    }); // Find activities with dates greater than or equal to current date
    res.status(200).json(upcomingActivities);
  } catch (error) {
    console.error("Error in getUpcomingActivities:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};
