const Itinerary = require("../models/Itinerary");
const Tourist = require("../models/Tourist");
const Guide = require("../models/Guide");
const Activity = require("../models/Activity");
const Venue = require("../models/venue");

// Create a new itinerary
exports.createItinerary = async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    const savedItinerary = await itinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all itineraries
exports.getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate("guideId");
    14;
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all itineraries not hidden
exports.getAllItinerariesNH = async (req, res) => {
  console.log("\n\n\n\n");

  try {
    const currentDate = new Date();
    const itineraries = await Itinerary.find({
      hidden: { $ne: true },
      active: { $ne: false },
      availableDateTime: { $elemMatch: { date: { $gt: currentDate } } },
    }).populate("guideId");

    const updatedItineraries = await Promise.all(
      itineraries.map(async (itinerary) => {
        const itineraryObj = itinerary.toObject(); // Convert to plain object

        // Modify the timeline for each itinerary
        for (const item of itineraryObj.timeline) {
          console.log("Item ID:", item.id);

          if (item.type === "Activity") {
            const activity = await Activity.findById(item.id);
            console.log("Activity Found:", activity);
            item.id = activity; // Replace ObjectId with full document
          } else if (item.type === "Venue") {
            const venue = await Venue.findById(item.id);
            console.log("Venue Found:", venue);
            item.id = venue; // Replace ObjectId with full document
          }
        }

        return itineraryObj; // Return the modified itinerary object
      })
    );

    res.status(200).json(updatedItineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItinerariesByIds = async (req, res) => {
  try {
    const { itineraryIds } = req.body;
    const itineraries = await Itinerary.find({
      _id: { $in: itineraryIds },
    }).populate("guideId");
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get itinerary by ID
exports.getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate(
      "guideId"
    );

    const itineraryObj = itinerary.toObject(); // Convert to plain object

    // Modify the timeline for each itinerary
    for (const item of itineraryObj.timeline) {
      console.log("Item ID:", item.id);

      if (item.type === "Activity") {
        const activity = await Activity.findById(item.id);
        console.log("Activity Found:", activity);
        item.id = activity; // Replace ObjectId with full document
      } else if (item.type === "Venue") {
        const venue = await Venue.findById(item.id);
        console.log("Venue Found:", venue);
        item.id = venue; // Replace ObjectId with full document
      }
    }

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json(itineraryObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update itinerary by ID
exports.updateItinerary = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete itinerary by ID
exports.deleteItinerary = async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deletedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req37 TESTED
exports.searchByName = async (req, res) => {
  //authentication middleware

  const searchString = req.body.searchString || "";

  if (!searchString) {
    return res.status(400).json({ message: "Search string is required" });
  }

  try {
    const itineraries = await Itinerary.find({
      name: { $regex: searchString, $options: "i" },
    });
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req54 & req55 TESTED
exports.giveItineraryFeedback = async (req, res) => {
  //authentication middleware
  //validation middleware

  try {
    const { touristId, itineraryId } = req.params;
    const { rating, comments } = req.body;

    if (!rating || !comments) {
      return res.status(400).json({ message: "Bad request" });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    //these conditions are no longer needed since button for feedback will only appear if allowed
    /*if (tourist.gaveFeedback.includes(itineraryId)) {
      return res.status(400).json({ message: "Feedback already given" });
    }

    //TODO if tourist booked itinerary on multiple occassions what will happen
    const itineraryBooking = tourist.itineraryBookings.find(
      (booking) =>
        booking.itineraryId.toString() === itineraryId &&
        booking.date < new Date()
    );

    if (!itineraryBooking) {
      return res
        .status(400)
        .json({ message: "No valid past itinerary booking found" });
    }*/

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const touristName = tourist.username;

    // append the feedback to the itinerary
    itinerary.feedback.push({ touristName, rating, comments });
    tourist.gaveFeedback.push(itineraryId);
    await tourist.save();

    await itinerary.save();

    res.status(200).json({
      message: "Feedback submitted successfully",
      feedback: itinerary.feedback,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//--req 20---
exports.createSpecifiedItinerary = async (req, res) => {
  try {
    const { guideId } = req.params; // geeb guideId from the URL
    const {
      name,
      timeline, // haykhod array of activities/venues
      language,
      price,
      availableDateTime,
      accessibility,
      pickUp,
      dropOff,
      tags,
      maxTourists,
    } = req.body;
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    if (guide.requestingDeletion) {
      return res.status(400).json({
        message: "There is a deletion request. Cant Create Itinerary",
      });
    }
    if (guide.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }

    const newItinerary = new Itinerary({
      guideId,
      name,
      timeline, // array of objects with start, id, type, and duration
      language,
      price,
      availableDateTime,
      accessibility,
      pickUp,
      dropOff,
      maxTourists,
      hidden: false,
      active: true,
      tags,
    });
    //const newItinerary = new Itinerary(req.body);

    newItinerary.save();

    res.status(201).json(newItinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.readItinerariesOfGuide = async (req, res) => {
  try {
    const { guideId } = req.params; // Get guideId from the URL

    const itineraries = await Itinerary.find({ guideId, hidden: false });
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (guide.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    if (!itineraries || itineraries.length === 0) {
      //return res.status(404).json({ message: 'No itineraries found for this guide.' });
    }

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItineraryFilteredFields = async (req, res) => {
  try {
    const { guideId, itineraryId } = req.params;
    const {
      name,
      timeline,
      language,
      price,
      availableDateTime,
      accessibility,
      pickUp,
      dropOff,
      active,
      tags,
      maxTourists,
    } = req.body;
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (guide.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    const itinerary = await Itinerary.findOne({ _id: itineraryId, guideId });
    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary not found or you are not authorized to update it.",
      });
    }

    // e3ml update to only the allowed fields
    if (name) itinerary.name = name;
    if (timeline) itinerary.timeline = timeline;
    if (language) itinerary.language = language;
    if (price) itinerary.price = price;
    if (availableDateTime) itinerary.availableDateTime = availableDateTime;
    if (accessibility) itinerary.accessibility = accessibility;
    if (pickUp) itinerary.pickUp = pickUp;
    if (dropOff) itinerary.dropOff = dropOff;
    if (maxTourists) itinerary.maxTourists = maxTourists;
    if (active !== undefined) itinerary.active = active;
    if (tags) itinerary.tags = tags;

    const updatedItinerary = await itinerary.save();

    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSpecificItinerary = async (req, res) => {
  try {
    const { guideId, itineraryId } = req.params;

    const itinerary = await Itinerary.findOne({ _id: itineraryId, guideId });
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (guide.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary not found or you are not authorized to delete it.",
      });
    }

    const tourists = await Tourist.find();
    for (const tourist of tourists) {
      const hasBooking = tourist.itineraryBookings.some(
        (booking) => booking.itineraryId.toString() === itineraryId
      );

      if (hasBooking) {
        return res.status(400).json({
          message: "Cannot delete itinerary; there are existing bookings.",
        });
      }
    }

    itinerary.hidden = true; //mark as hidden
    await itinerary.save();

    res
      .status(200)
      .json({ message: "Itinerary has been successfully removed." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//req44
exports.getUpcomingItineraries = async (req, res) => {
  try {
    const currentDate = new Date();
    // Find itineraries with available dates greater than or equal to the current date and hidden is false
    const itineraries = await Itinerary.find({
      "availableDateTime.date": { $gte: currentDate },
      hidden: false,
    })
      .populate("guideId")
      .populate({
        path: "timeline.id",
        model: function (doc) {
          return doc.type === "Activity" ? "Activity" : "Venue";
        },
      });

    if (!itineraries || itineraries.length === 0) {
      //return res.status(404).json({ message: "No upcoming itineraries found" });
    }

    res.status(200).json(itineraries);
  } catch (error) {
    console.error("Error in getUpcomingItineraries:", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};

//returns list of not hidden activities and venues alongside their type
exports.fetchOptions = async (req, res) => {
  try {
    const activities = await Activity.find({ hidden: false });
    const venues = await Venue.find({ isVisible: true });
    const options = activities.concat(venues).map((option) => ({
      id: option._id,
      name: option.name,
      type: option.governorId ? "Venue" : "Activity",
    }));
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItinerariesByPreferrences = async (req, res) => {
  res.status(200).json({ null: "null" });
}


//flag and delete itenerary han call delete 3ady baa a3taked.
// flag and hide itinerary
exports.hideItinerary = async (req, res) => {
  const { id: itineraryId } = req.params; // Extract itineraryId from req.params

  console.log("ENGYY"); // Check if function is reached

  try {
      // Update the itinerary to set hidden to true
      const updatedItinerary = await Itinerary.findByIdAndUpdate(
          itineraryId,
          { hidden: true },
          { new: true }
      );

      if (!updatedItinerary) {
          return res.status(404).json({ message: 'Itinerary not found' });
      }

      console.log(`Itinerary ${itineraryId} has been hidden successfully.`);
      res.status(200).json({ message: `Itinerary ${itineraryId} has been hidden successfully.`, updatedItinerary });
  } catch (error) {
      console.error(`Error hiding itinerary: ${error.message}`);
      res.status(500).json({ message: `Error hiding itinerary: ${error.message}` });
  }
};



