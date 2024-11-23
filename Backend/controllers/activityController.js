const Activity = require("../models/Activity");
const Advertiser = require("../models/Advertiser");
const Tourist = require("../models/Tourist");
const Tag = require("../models/Tag");
const Category = require("../models/Category");
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
    const activities = await Activity.find().populate("advertiserId");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get admin activities.
exports.getAdminActivities = async (req, res) => {
  try {
    const activities = await Activity.find({   $nor: [{ hidden: true, isFlagged: false }] }).populate("advertiserId");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all activities not hidden
exports.getAllActivitiesNH = async (req, res) => {
  try {
    const currentDate = new Date();
    const activities = await Activity.find({hidden: { $ne: true }, isOpen: { $ne: false }, date: { $gt: currentDate }}).populate("advertiserId");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllHasBookings = async (req, res) => {
  try {

    const touristId = req.params.id;

    const tourist = await Tourist.findById(touristId);

    if(!tourist) {
      return res.status(404).json({message: "Tourist not found"});
    }
    const currentDate = new Date();
    const activityIds = tourist.activityBookings.map(booking => booking.activityId);
    const activities = await Activity.find({
      _id: { $in: activityIds },
      date: { $gt: currentDate },
      hidden: { $ne: true }
    }).populate("advertiserId");    
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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

    if (!rating || !comments) {
      return res.status(400).json({ message: "Bad request" });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    //these conditions are no longer needed since button for feedback will only appear if allowed
    /*if (tourist.gaveFeedback.includes(activityId)) {
      return res.status(400).json({ message: "Feedback already given" });
    }

    const activityBooking = tourist.activityBookings.find(
      (booking) => booking.activityId.toString() === activityId
    );

    if (!activityBooking) {
      return res
        .status(400)
        .json({ message: "No valid past activity booking found" });
    }*/

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    if (activity.date > new Date()) {
      return res
        .status(400)
        .json({ message: "No valid past activity booking found" });
    }
    const touristName = tourist.username;

    // append the feedback to the activity
    activity.feedback.push({ touristName, rating, comments });
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
    const { advertiserId } = req.params;
    const {
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
    const advertiser = await Advertiser.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    if (advertiser.requestingDeletion) {
      return res
        .status(400)
        .json({ message: "There is a deletion request. Cant Create Activity" });
    }
    if (advertiser.acceptedTerms == false) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (advertiser.pending == true) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }

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
      isFlagged: false,
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
    const { advertiserId } = req.params;
    const advertiser = await Advertiser.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    if (!advertiser.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (advertiser.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    const activities = await Activity.find({
      advertiserId,
      $or: [{ hidden: false }, { hidden: true, isFlagged: true }],
    });

    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: 'No activities found for this advertiser.' });
    }
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteSpecificActivity = async (req, res) => {
  try {
    const { advertiserId, activityId } = req.params;
    const advertiser = await Advertiser.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    if (!advertiser.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (advertiser.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    const activity = await Activity.findOne({
      _id: activityId,
      advertiserId: advertiserId,
    });
    if (!activity) {
      return res.status(404).json({
        message: "Activity not found or you are not authorized to delete it.",
      });
    }
    const tourists = await Tourist.find();
    for (const tourist of tourists) {
      const hasBooking = tourist.activityBookings.some(
        (booking) => booking.activityId.toString() === activityId
      );

      if (hasBooking) {
        return res.status(400).json({
          message: "There are existing bookings.",
        });
      }
    }

    activity.hidden = true;
    await activity.save();

    res.status(200).json({ message: "Activity is now marked as hidden." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateActivityFilteredFields = async (req, res) => {
  try {
    const { advertiserId, activityId } = req.params;
    const {
      name,
      date,
      time,
      location,
      upper,
      lower,
      category,
      tags,
      spots,
      discounts,
      isOpen,
    } = req.body;
    const advertiser = await Advertiser.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    if (!advertiser.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (advertiser.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    // Log IDs for debugging

    const activity = await Activity.findOne({
      _id: activityId,
      advertiserId: advertiserId,
    });
    if (!activity) {
      return res.status(404).json({
        message: "Activity not found or you are not authorized to update it.",
      });
    }

    // updating only the allowed fields
    if (name) activity.name = name;
    if (date) activity.date = date;
    if (time) activity.time = time;
    if (location) activity.location = location;
    if (upper) activity.upper = upper;
    if (lower) activity.lower = lower;
    if (spots) activity.spots = spots;
    if (category) activity.category = category;
    if (tags) activity.tags = tags;
    if (discounts) activity.discounts = discounts;
    if (isOpen !== undefined) activity.isOpen = isOpen;

    const updatedActivity = await activity.save();

    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//req 44
exports.getUpcomingActivities = async (req, res) => {
  try {
    const currentDate = new Date();

    // Find activities with dates greater than or equal to the current date and hidden is false
    const upcomingActivities = await Activity.find({
      date: { $gte: currentDate },
      hidden: false,
    });

    if (!upcomingActivities || upcomingActivities.length === 0) {
      //return res.status(404).json({ message: "No upcoming activities found" });
    }

    res.status(200).json(upcomingActivities);
  } catch (error) {
    console.error("Error in getUpcomingActivities:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

exports.getActivitiesByPreferrences = async (req, res) => {
  res.status(200).json({ null: "null" });
};

// flag activity inappropriate then hide it
exports.hideActivity = async (req, res) => {
  const { id: activityId } = req.params;

  try {
    // Update the activity to be hidden and flagged
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { hidden: true, isFlagged: true },
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Get the advertiserId associated with this activity
    const selectedAdvertiserId = updatedActivity.advertiserId;
    //  console.log("Selected Advertiser ID: ", selectedAdvertiserId);

    // Find the advertiser by ID
    const advertiser = await Advertiser.findById(selectedAdvertiserId);

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    // Create a notification for the advertiser
    const notificationText = `Your activity with ID ${activityId} has been flagged as inappropriate.`;
    advertiser.notifications.push({
      text: notificationText,
      seen: false, // Set to false initially, you can update it when the advertiser views it
    });

    // Save the updated advertiser
    await advertiser.save();

    res.status(200).json({
      message: `Activity ${activityId} has been hidden successfully and the advertiser has been notified.`,
      updatedActivity,
    });
  } catch (error) {
    console.error(`Error hiding activity: ${error.message}`);
    res
      .status(500)
      .json({ message: `Error hiding activity: ${error.message}` });
  }
};

exports.unhideActivity = async (req, res) => {
  const { id: activityId } = req.params;

  try {
    // Update the activity to be unhidden and unflagged
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { hidden: false, isFlagged: false },
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Get the advertiserId associated with this activity
    const selectedAdvertiserId = updatedActivity.advertiserId;

    // Find the advertiser by ID
    const advertiser = await Advertiser.findById(selectedAdvertiserId);

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    // Remove the notification related to the hidden/flagged activity
    // Assuming that the notification text includes the activity ID
    const notificationText = `Your activity with ID ${activityId} has been flagged as inappropriate.`;
    const notificationIndex = advertiser.notifications.findIndex(
      (notification) => notification.text === notificationText
    );

    if (notificationIndex !== -1) {
      // Remove the notification from the array
      advertiser.notifications.splice(notificationIndex, 1);
      await advertiser.save(); // Save the updated advertiser
    }

    res.status(200).json({
      message: `Activity ${activityId} has been unhidden successfully and the notification has been removed.`,
      updatedActivity,
    });
  } catch (error) {
    console.error(`Error unhiding activity: ${error.message}`);
    res
      .status(500)
      .json({ message: `Error unhiding activity: ${error.message}` });
  }
};
