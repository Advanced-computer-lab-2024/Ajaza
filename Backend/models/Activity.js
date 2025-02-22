const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  //an event is an activity
  advertiserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Advertiser",
  }, // Reference to the advertiser
  name: { type: String, required: true }, // name of activity
  date: { type: Date, required: true }, // Date of the activity
  location: { type: String, required: true }, // Google Maps link or location description
  upper: { type: Number, required: true }, // TODO
  lower: { type: Number, required: true }, // Lower limit (equal to upper if not a range)
  category: [{ type: String, required: true }], // Activity category: advertiser chooses this when creating
  tags: [{ type: String }], // Array of tags related to the activity, advertiser enters them as he wants
  discounts: { type: Number, default: 0 }, // TODO
  isOpen: { type: Boolean, default: true }, // Booking availability
  feedback: [
    {
      touristName: { type: String },
      rating: { type: Number, min: 1, max: 5, required: true }, // Rating between 1 and 5
      comments: { type: String, required: true },
    },
  ],
  spots: { type: Number, required: true },
  hidden: { type: Boolean, default: false },
  transportation: {
    from: { type: String },
    to: { type: String },
  },
  isFlagged: {type: Boolean, default: false},
  pictures: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Img" },
  ],
});

// Create the model
const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
