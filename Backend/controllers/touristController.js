const Tourist = require("../models/Tourist");
const Activity = require("../models/Activity");
const Itinerary = require("../models/Itinerary");
const Guide = require("../models/Guide");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function isAdult(dob) {
  // Convert the dob string to a Date object
  const birthDate = new Date(dob);
  const today = new Date();

  // Calculate the age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if the birth date hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // Return true if age is 18 or older, otherwise false
  return age >= 18;
}

// Create a new tourist
exports.createTourist = async (req, res) => {
  try {
    const tourist = new Tourist(req.body);
    const savedTourist = await tourist.save();
    res.status(201).json(savedTourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tourists
exports.getAllTourists = async (req, res) => {
  try {
    const tourists = await Tourist.find();
    res.status(200).json(tourists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tourist by ID
exports.getTouristById = async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update tourist by ID
exports.updateTourist = async (req, res) => {
  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete tourist by ID
exports.deleteTourist = async (req, res) => {
  try {
    const deletedTourist = await Tourist.findByIdAndDelete(req.params.id);
    if (!deletedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(200).json({ message: "Tourist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// tourist updates his profile req11 TESTED
exports.touristUpdateProfile = async (req, res) => {
  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Exclude the pass field
    updatedTourist.pass = undefined;

    // Generate a new JWT token
    const token = jwt.sign(
      {
        userId: updatedTourist._id,
        role: "tourist",
        userDetails: updatedTourist,
      }, // Include user data in the token
      process.env.JWT_SECRET, // Use the environment variable
      { expiresIn: "1h" }
    );

    res.status(201).json({ updatedTourist, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//tourist read profile req11 TESTED
exports.touristReadProfile = async (req, res) => {
  try {
    const touristProfile = await Tourist.findById(req.params.id).select(
      "-pass"
    );

    if (!touristProfile) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(201).json(touristProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// req50 TESTED
exports.emailShare = async (req, res) => {
  //authentication middleware
  //validation middleware

  const { link, email } = req.body;
  const touristId = req.params.id;

  if (!touristId) {
    return res.status(400).json({ message: "Tourist ID is required" });
  }

  if (!link || !email) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const tourist = await Tourist.findById(touristId).select("username");

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS,
      },
    });

    const mailOptions = {
      from: "reservy.me@gmail.com",
      to: email,
      subject: "Check out what I found on Ajaza!",
      html:
        "<h1>Your friend " +
        tourist.username +
        ' shared a link with you!</h1> \n\n<a href="' +
        link +
        '"><button>Go to link</button></a>',
    };

    transporter.sendMail(mailOptions)
      .then(info => console.log("Email sent: ", info.response))
      .catch(error => console.error("Error sending email: ", error));

    res.status(200).json({ message: "Email is being sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req61 TESTED
exports.cancelActivityBooking = async (req, res) => {
  //authentication middleware

  try {
    const touristId = req.params.touristId;
    const activityId = req.params.activityId;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const now = new Date();
    const hoursDifference = (new Date(activity.date) - now) / (1000 * 60 * 60); // difference in hours

    if (hoursDifference < 48) {
      return res.status(400).json({
        message:
          "Cannot cancel the activity within 48 hours of its scheduled time.",
      });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // find the booking for the activity and remove it
    const bookingIndex = tourist.activityBookings.findIndex(
      (booking) => booking.activityId.toString() === activityId
    );

    if (bookingIndex === -1) {
      return res
        .status(404)
        .json({ message: "Activity booking not found for this tourist." });
    }

    const totalPaid = tourist.activityBookings[bookingIndex].total;
    tourist.wallet += totalPaid;

    // remove the booking from the tourist activity bookings
    tourist.activityBookings.splice(bookingIndex, 1);

    await tourist.save();

    activity.spots += 1;
    await activity.save();

    res.status(200).json({
      message: "Activity booking canceled successfully",
      refund: totalPaid,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//req61 TESTED
exports.cancelItineraryBooking = async (req, res) => {
  //authentication middleware

  //itinerary: 66f6adef0f0094718a1f6050

  try {
    const touristId = req.params.touristId;
    const itineraryId = req.params.itineraryId;

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    console.log(tourist.itineraryBookings);
    console.log(itineraryId);

    const bookingIndex = tourist.itineraryBookings.findIndex(
      (booking) => booking.itineraryId.toString() === itineraryId
    );

    if (bookingIndex === -1) {
      return res
        .status(404)
        .json({ message: "Itinerary booking not found for this tourist." });
    }

    const itineraryDate = tourist.itineraryBookings[bookingIndex].date;

    const now = new Date();
    const hoursDifference = (new Date(itineraryDate) - now) / (1000 * 60 * 60); // difference in hours

    if (hoursDifference < 48) {
      return res.status(400).json({
        message:
          "Cannot cancel the itinerary within 48 hours of its scheduled time.",
      });
    }

    // increasing spots
    const availableDate = itinerary.availableDateTime.find(
      (dateEntry) =>
        dateEntry.date.toISOString() === itineraryDate.toISOString()
    );

    if (availableDate) {
      availableDate.spots += 1;
    } else {
      return res.status(404).json({
        message: "Available DateTime not found (cannot restore spots)",
      });
    }

    const totalPaid = tourist.itineraryBookings[bookingIndex].total;
    tourist.wallet += totalPaid;

    // remove the booking from the tourist itinerary bookings
    tourist.itineraryBookings.splice(bookingIndex, 1);

    await tourist.save();
    await itinerary.save();

    res.status(200).json({
      message: "Itinerary booking canceled successfully",
      refund: totalPaid,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req 72 TESTED
exports.redeemPoints = async (req, res) => {
  //authentication middleware

  try {
    const touristId = req.params.id;

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    if (tourist.points < 10000) {
      return res.status(404).json({ message: "Not enough points." });
    }

    const maxRedeemablePoints = Math.floor(tourist.points / 10000) * 100; // For every 10,000 points, redeem $100
    if (maxRedeemablePoints < 100) {
      return res.status(400).json({ message: "Not enough points to redeem." });
    }

    tourist.wallet += maxRedeemablePoints;
    tourist.points -= (maxRedeemablePoints * 10000) / 100;

    // Save the updated tourist document
    await tourist.save();

    // Respond with the updated tourist data
    res.status(200).json({
      message: "Points redeemed successfully!",
      wallet: tourist.wallet,
      points: tourist.points,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req58 req70 req71
exports.bookActivity = async (req, res) => {
  try {
    const { touristId, activityId } = req.params;
    const { useWallet, total, promoCode, paymentMethodId } = req.body; // Boolean to check if wallet should be used for payment, and total passed from frontend

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (!isAdult(tourist.dob)) {
      return res.status(418).json({ message: "Tourist is not an adult" });
    }

    //this condition may be commented since handling it in the frontend
    if (promoCode && tourist.usedPromoCodes.includes(promoCode)) {
      return res
        .status(404)
        .json({ message: "You already used this promo code" });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // check if the activity is open for booking
    if (!activity.isOpen && activity.spots <= 0) {
      return res
        .status(400)
        .json({ message: "This activity is not open for booking" });
    }

    // if the wallet is being used, check if the tourist has enough balance
    if (useWallet) {
      if (tourist.wallet < total) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      tourist.wallet -= total;
    } else {
      // Process payment using the extracted function
      const amount = total * 100; // Convert to cents for Stripe
      try {
        const paymentIntent = await processPayment(amount, paymentMethodId);

        // Check if the payment was successful
        if (paymentIntent.status !== "succeeded") {
          return res.status(400).json({ message: "Payment failed" });
        }
      } catch (error) {
        return res
          .status(400)
          .json({ message: `Payment failed: ${error.message}` });
      }
    }

    // deduct 1 spot from the activity
    activity.spots -= 1;

    // Add the booking to the tourist's activityBookings array
    tourist.activityBookings.push({
      activityId: activity._id,
      total: total,
    });

    if (promoCode) {
      tourist.usedPromoCodes.push(promoCode);
    }

    var newPoints;
    switch (tourist.badge) {
      case 1:
        newPoints = 0.5 * total;
        break;
      case 2:
        newPoints = total;
        break;
      case 3:
        newPoints = 1.5 * total;
        break;
      default:
        newPoints = 0.5 * total;
    }

    tourist.points += Math.floor(newPoints);
    tourist.totalPoints += Math.floor(newPoints);

    if (tourist.totalPoints > 500000) {
      tourist.badge = 3;
    } else if (tourist.totalPoints > 100000) {
      tourist.badge = 2;
    } else {
      tourist.badge = 1;
    }

    const paymentMethod = useWallet ? "wallet" : "card";

    tourist.notifications.push({
      text: `Booking confirmed for ${activity.name}`,
      seen: false,
      activityId: activity._id,
    });
    sendEmail(
      tourist.email,
      `Booking confirmed for ${activity.name}`,
      `Your payment of ${total} by ${paymentMethod} was confirmed. You have successfully booked ${activity.name} on ${activity.date}.`
    );

    // Save both the tourist and activity updates
    await tourist.save();
    await activity.save();

    res.status(200).json({ message: "Activity booked successfully", tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bookItinerary = async (req, res) => {
  try {
    const { touristId, itineraryId } = req.params;
    const { useWallet, total, date, promoCode, paymentMethodId } = req.body; // Boolean to check if wallet should be used for payment, and total passed from frontend

    if (!date || !total) {
      return res.status(400).json({ message: "Date and total are required" });
    }

    if (date < new Date()) {
      return res.status(400).json({ message: "Date must be in the future" });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (!isAdult(tourist.dob)) {
      return res.status(400).json({ message: "Tourist is not an adult" });
    }

    //unnecessary condition
    if (promoCode && tourist.usedPromoCodes.includes(promoCode)) {
      return res
        .status(404)
        .json({ message: "You already used this promo code" });
    }

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // check if the itinerary is open for booking
    if (!itinerary.active) {
      return res
        .status(400)
        .json({ message: "This itinerary is not open for booking" });
    }
    const factoredDate = new Date(date);

    const availableDate = itinerary.availableDateTime.find(
      (dateObj) => dateObj.date.getTime() === factoredDate.getTime()
    );

    if (!availableDate || availableDate.spots <= 0) {
      return res.status(400).json({
        message: "No spots available for this itinerary on the selected date",
      });
    }

    // check if date is in future and has an availableDateTime === date passed

    // if the wallet is being used, check if the tourist has enough balance
    if (useWallet && useWallet === true) {
      if (tourist.wallet < total) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      tourist.wallet -= total;
    } else {
      // Process payment using the extracted function
      const amount = total * 100; // Convert to cents for Stripe
      try {
        const paymentIntent = await processPayment(amount, paymentMethodId);

        // Check if the payment was successful
        if (paymentIntent.status !== "succeeded") {
          return res.status(400).json({ message: "Payment failed" });
        }
      } catch (error) {
        return res
          .status(400)
          .json({ message: `Payment failed: ${error.message}` });
      }
    }

    // deduct 1 spot from the itinerary
    availableDate.spots -= 1;

    // add the booking to the tourist's itineraryBookings array
    tourist.itineraryBookings.push({
      itineraryId: itinerary._id,
      date: date,
      total: total,
    });

    if (promoCode) {
      tourist.usedPromoCodes.push(promoCode);
    }

    var newPoints;
    switch (tourist.badge) {
      case 1:
        newPoints = 0.5 * total;
        break;
      case 2:
        newPoints = total;
        break;
      case 3:
        newPoints = 1.5 * total;
        break;
      default:
        newPoints = 0.5 * total;
    }

    tourist.points += Math.floor(newPoints);
    tourist.totalPoints += Math.floor(newPoints);

    if (tourist.totalPoints > 500000) {
      tourist.badge = 3;
    } else if (tourist.totalPoints > 100000) {
      tourist.badge = 2;
    } else {
      tourist.badge = 1;
    }

    const paymentMethod = useWallet ? "wallet" : "card";

    tourist.notifications.push({
      text: `Booking confirmed for ${itinerary.name}`,
      seen: false,
      itineraryId: itinerary._id,
    });
    sendEmail(
      tourist.email,
      `Booking confirmed for ${itinerary.name}`,
      `Your payment of ${total} by ${paymentMethod} was confirmed. You have successfully booked ${itinerary.name} on ${itinerary.date}.`
    );

    // Save both the tourist and itinerary updates
    await tourist.save();
    await itinerary.save();

    res.status(200).json({ message: "Itinerary booked successfully", tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//              req4 -- Tatos           //
// Geuest/Tourist sign up
exports.guestTouristCreateProfile = async (req, res) => {
  // TODO: validation of the input data
  // TODO: check the comment section for this requirement

  // Allowed fields
  const allowedFields = [
    "username",
    "email",
    "pass",
    "mobile",
    "nationality",
    "dob",
    "occupation",
  ];

  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === "dob") {
        filteredBody[field] = new Date(req.body[field]);
      } else {
        filteredBody[field] = req.body[field];
      }
    }
  });

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(filteredBody.pass, saltRounds);

    filteredBody.pass = hashedPassword;

    const tourist = new Tourist(filteredBody);
    const savedTourist = await tourist.save();
    savedTourist.pass = undefined;
    res.status(201).json(savedTourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// admin delete tourists requesting deletion
exports.deleteTouristsRequestingDeletion = async (req, res) => {
  try {
    const tourists = await Tourist.find({ requestingDeletion: true });

    if (tourists.length === 0) {
      return res
        .status(404)
        .json({ message: "No tourists found requesting deletion" });
    }

    for (const tourist of tourists) {
      await Tourist.findByIdAndDelete(tourist._id);
    }

    res.status(200).json({ message: "Tourists deleted successfully" });
  } catch (error) {
    console.error("Error deleting tourists:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.adminDeletesTourists = async (req, res) => {
  const touristIds = req.body.touristIds;
  if (!touristIds || !touristIds.length) {
    return res.status(400).json({ error: "Tourist IDs are required" });
  }
  try {
    const result = await Tourist.deleteMany({
      _id: { $in: touristIds },
      requestingDeletion: true,
    });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Tourists selected were not requesting deletion" });
    }
    res.status(200).json({ message: "Tourists deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.adminDeletesTouristFromSystem = async (req, res) => {
  const touristId = req.params.id;
  if (!touristId) {
    return res.status(400).json({ error: "Tourist ID is required" });
  }
  try {
    const deletedtourist = await Tourist.findByIdAndDelete(touristId);
    if (!deletedtourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(200).json({ message: "Tourist deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptTerms = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Tourist.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.acceptedTerms = true;
    await user.save();
    res.status(200).json({ message: "Terms accepted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//req111
exports.getApplicablePromoCodes = async (req, res) => {
  try {
    const touristId = req.params.id;
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    let returnedPromoCodes = [];

    const birthday = tourist.dob;
    const promoCodesBD = await PromoCode.findOne({
      "birthday.date": birthday,
    });

    let within2Days = false;

    const currentYear = new Date().getFullYear();

    const birthdayThisYear = new Date(
      currentYear,
      birthday.getMonth(),
      birthday.getDate()
    );

    const twoDaysAfter = new Date(birthdayThisYear);
    twoDaysAfter.setDate(birthdayThisYear.getDate() + 2);

    within2Days = today >= twoDaysAfter && today <= birthdayThisYear;

    if (promoCodesBD && within2Days) {
      returnedPromoCodes.push(
        json({ code: promoCodesBD[0].code, value: promoCodesBD[0].value })
      );
    }

    const promoCodes = await PromoCode.find({
      code: { $nin: tourist.usedPromoCodes },
      $or: [
        { birthday: { $exists: false } }, // No birthday field at all
        { birthday: null }, // Birthday field exists but is null
      ],
    });

    for (let i = 0; i < promoCodes.length; i++) {
      returnedPromoCodes.push(
        json({ code: promoCodes[i].code, value: promoCodes[i].value })
      );
    }

    res.status(200).json(returnedPromoCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// birthdayEventTriggered
exports.birthdayEventTriggered = async (usersWithBirthdayToday) => {
  try {
    const today = new Date();

    const uniquePromoCode = await generateUniqueCode(); //generate a unique 6-character promo code

    const newPromoCode = new PromoCode({
      code: uniquePromoCode,
      value: 0.2, // the discount value
      birthday: {
        date: today,
      },
    });

    await newPromoCode.save();

    for (let i = 0; i < usersWithBirthdayToday.length; i++) {
      const tourist = await Tourist.findById(usersWithBirthdayToday[i]._id);
      if (!tourist) {
        console.error("Tourist not found");
        continue;
      }

      tourist.notifications.push({
        text: "Happy birthday! Here's a promo code for you: " + uniquePromoCode,
        seen: false,
      });

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODE_MAILER_USER,
          pass: process.env.NODE_MAILER_PASS,
        },
      });

      const mailOptions = {
        from: "reservy.me@gmail.com",
        to: tourist.email,
        subject: "Happy Birthday!",
        html:
          "<h1>Happy Birthday from Ajaza</h1><h4>Here is a promo code for you,</h4><h2>" +
          uniquePromoCode +
          "</h2>",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
        }
      });

      await tourist.save();
    }

    //console.log("Promo code created successfully:", newPromoCode);
  } catch (error) {
    console.error("Error creating promo code:", error);
  }
};

//helper
const generateUniqueCode = async () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code;
  let existingCode;

  do {
    // Generate a random 6-letter code
    code = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");

    // Check if this code already exists in the database
    existingCode = await PromoCode.findOne({ code });
  } while (existingCode);

  return code;
};

// helper for feedback
exports.getHistory = async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id)
      .populate("activityBookings.activityId")
      .populate("itineraryBookings.itineraryId")
      .populate("orders.products.productId");

    if (!tourist) {
      throw new Error("Tourist not found");
    }

    const currentDate = new Date();
    let activities = [];
    for (let i = 0; i < tourist.activityBookings.length; i++) {
      if (tourist.activityBookings[i].activityId.date < currentDate) {
        activities.push({
          activityId: tourist.activityBookings[i].activityId._id,
          name: tourist.activityBookings[i].activityId.name,
          date: tourist.activityBookings[i].activityId.date,
          gaveFeedback: tourist.gaveFeedback.includes(
            tourist.activityBookings[i].activityId._id
          ),
        });
      }
    }
    let itineraries = [];
    let guides = [];
    let guideNames = [];
    for (let i = 0; i < tourist.itineraryBookings.length; i++) {
      if (tourist.itineraryBookings[i].date < currentDate) {
        itineraries.push({
          itineraryId: tourist.itineraryBookings[i].itineraryId._id,
          name: tourist.itineraryBookings[i].itineraryId.name,
          date: tourist.itineraryBookings[i].date,
          gaveFeedback: tourist.gaveFeedback.includes(
            tourist.itineraryBookings[i].itineraryId._id
          ),
        });
        console.log(
          "Itinerary guide id:",
          tourist.itineraryBookings[i].itineraryId.guideId
        );
        console.log("Tourist gave feedback:", tourist.gaveFeedback);
        const guideNumberOfTimesRated = tourist.gaveFeedback.filter((el) =>
          el.equals(tourist.itineraryBookings[i].itineraryId.guideId)
        ).length;
        const numberOfBookingsWithGuide = tourist.itineraryBookings.filter(
          (booking) => {
            return (
              booking.itineraryId &&
              booking.itineraryId.guideId.equals(
                tourist.itineraryBookings[i].itineraryId.guideId
              ) &&
              booking.date < currentDate
            );
          }
        ).length;
        console.log("Guide number of times rated:", guideNumberOfTimesRated);
        console.log(
          "Number of bookings with guide:",
          numberOfBookingsWithGuide
        );
        const guideName = await Guide.findById(
          tourist.itineraryBookings[i].itineraryId.guideId
        ).select("username");
        if (guideName && !guideNames.includes(guideName.username)) {
          guides.push({
            guideId: tourist.itineraryBookings[i].itineraryId.guideId,
            name: guideName.username,
            gaveFeedback: numberOfBookingsWithGuide < guideNumberOfTimesRated,
          });
          guideNames.push(guideName.username);
        }
      }
    }

    let products = [];
    for (let i = 0; i < tourist.orders.length; i++) {
      if(tourist.orders[i].date < currentDate && tourist.orders[i].status != "Cancelled") {
        for (let j = 0; j < tourist.orders[i].products.length; j++) {
          console.log("alooooo: ", tourist.orders[i].products[j].productId._id);
          products.push({
            productId: tourist.orders[i].products[j].productId._id,
            name: tourist.orders[i].products[j].productId.name,
            sellerName: tourist.orders[i].products[j].productId.sellerName,
            date: tourist.orders[i].date,
            gaveFeedback: tourist.gaveFeedback.includes(
              tourist.orders[i].products[j].productId
            ),
          });
        }
      }
    }
//66f6ae2a0f0094718a1f7d82 some product id to test
    res.status(200).json({
      activities: activities,
      itineraries: itineraries,
      guides: guides,
      products: products,
    });
  } catch (error) {
    console.error("Error retrieving past activity bookings:", error);
    throw error;
  }
};

async function sendEmail(email, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASS,
    },
  });

  const mailOptions = {
    from: "reservy.me@gmail.com",
    to: email,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}

//req63
exports.getFutureBookings = async (req, res) => {
  const { touristId } = req.params.id;
  const currentDate = new Date();

  try {
    const tourist = await Tourist.findById(touristId)
      .populate("activityBookings.activityId")
      .populate("itineraryBookings.itineraryId");

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    let activities = [];
    for (let i = 0; i < tourist.activityBookings.length; i++) {
      if (tourist.activityBookings[i].activityId.date > currentDate) {
        const hoursDifference =
          (new Date(tourist.activityBookings[i].activityId.date) -
            currentDate) /
          (1000 * 60 * 60);
        activities.push({
          activityId: tourist.activityBookings[i].activityId._id,
          name: tourist.activityBookings[i].activityId.name,
          date: tourist.activityBookings[i].activityId.date,
          canBeCancelled: hoursDifference > 48,
        });
      }
    }
    let itineraries = [];
    for (let i = 0; i < tourist.itineraryBookings.length; i++) {
      if (tourist.itineraryBookings[i].date > currentDate) {
        const hoursDifference =
          (new Date(tourist.itineraryBookings[i].date) - currentDate) /
          (1000 * 60 * 60);
        itineraries.push({
          itineraryId: tourist.itineraryBookings[i].itineraryId._id,
          name: tourist.itineraryBookings[i].itineraryId.name,
          date: tourist.itineraryBookings[i].date,
          canBeCancelled: hoursDifference > 48,
        });
      }
    }

    res.status(200).json({ activities: activities, itineraries: itineraries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//req65
exports.addActivityBookmark = async (req, res) => {
  const { touristId, activityId } = req.params;
  cleanActivityBookmarks(touristId);

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (!tourist.activityBookmarks.includes(activityId)) {
      tourist.activityBookmarks.push(activityId);
    }

    await tourist.save();

    res.status(200).json({ message: "Activity bookmarked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function cleanActivityBookmarks(touristId) {
  const tourist = await Tourist.findById(touristId);
  const activityBookmarks = tourist.activityBookmarks;

  const currentDate = new Date();
  for (let i = 0; i < activityBookmarks.length; i++) {
    const activity = await Activity.findById(activityBookmarks[i]);
    if (!activity) {
      activityBookmarks.splice(i, 1);
      i--;
    } else {
      if (activity.date < currentDate) {
        activityBookmarks.splice(i, 1);
        i--;
      } else {
        if (activity.hidden) {
          activityBookmarks.splice(i, 1);
          i--;
        }
      }
    }
  }

  tourist.activityBookmarks = activityBookmarks;
  await tourist.save();
}

//req65
exports.addItineraryBookmark = async (req, res) => {
  const { touristId, itineraryId } = req.params;
  cleanItineraryBookmarks(touristId);

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (!tourist.itineraryBookmarks.includes(itineraryId)) {
      tourist.itineraryBookmarks.push(itineraryId);
    }

    await tourist.save();

    res.status(200).json({ message: "Itinerary bookmarked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function cleanItineraryBookmarks(touristId) {
  const tourist = await Tourist.findById(touristId);
  const itineraryBookmarks = tourist.itineraryBookmarks;

  for (let i = 0; i < itineraryBookmarks.length; i++) {
    const itinerary = await Itinerary.findById(itineraryBookmarks[i]);
    if (!itinerary) {
      itineraryBookmarks.splice(i, 1);
      i--;
    } else {
      if (itinerary.hidden) {
        itineraryBookmarks.splice(i, 1);
        i--;
      }
    }
  }
  tourist.itineraryBookmarks = itineraryBookmarks;
  await tourist.save();
}

exports.requestAccountDeletion = async (req, res) => {
  const touristId = req.params.id; // Get tourist ID from the request parameters

  try {
    // Find the tourist
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res
        .status(404)
        .json({ success: false, message: "Tourist not found" });
    }

    // Get the current date
    const currentDate = new Date();

    // Check for upcoming activity bookings
    const upcomingActivityBookings = await Activity.find({
      _id: {
        $in: tourist.activityBookings.map((booking) => booking.activityId),
      },
      date: { $gt: currentDate },
      isOpen: true, // Ensure the activity is open for booking
    });

    // Check for upcoming itinerary bookings
    const upcomingItineraryBookings = await Itinerary.find({
      _id: {
        $in: tourist.itineraryBookings.map((booking) => booking.itineraryId),
      },
      availableDateTime: { $elemMatch: { date: { $gt: currentDate } } },
    });

    // If there are upcoming bookings, deny the request
    if (
      upcomingActivityBookings.length > 0 ||
      upcomingItineraryBookings.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot mark account for deletion with upcoming bookings.",
      });
    }

    // Set requestingDeletion to true
    tourist.requestingDeletion = true;
    await tourist.save();

    return res.status(200).json({
      success: true,
      message: "Account marked for deletion successfully.",
    });
  } catch (error) {
    console.error("Error marking account for deletion:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while requesting account deletion.",
    });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { touristId, productId } = req.body;

    // Find the tourist by ID
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the wishlist
    if (tourist.wishlist.includes(productId)) {
      return res
        .status(400)
        .json({ message: "Product is already in the wishlist" });
    }

    // Add the product to the wishlist
    tourist.wishlist.push(productId);
    await tourist.save();

    res.status(200).json({ message: "Product added to wishlist successfully" });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({
      message: "An error occurred while adding the product to the wishlist",
    });
  }
};

exports.viewWishlist = async (req, res) => {
  try {
    const { touristId } = req.params;

    // Find the tourist by ID and populate the wishlist with product details
    const tourist = await Tourist.findById(touristId).populate("wishlist");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ wishlist: tourist.wishlist });
  } catch (error) {
    console.error("Error retrieving wishlist:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the wishlist" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { touristId, productId } = req.body;

    // Find the tourist by ID
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the product is in the wishlist
    const productIndex = tourist.wishlist.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Remove the product from the wishlist
    tourist.wishlist.splice(productIndex, 1);
    await tourist.save();

    res
      .status(200)
      .json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({
      message: "An error occurred while removing the product from the wishlist",
    });
  }
};

exports.addToCartFromWishlist = async (req, res) => {
  try {
    const { touristId, productId, quantity } = req.body;

    // Find the tourist by ID
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the product is in the wishlist
    const productIndex = tourist.wishlist.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Check if the product is already in the cart
    const cartIndex = tourist.cart.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (cartIndex !== -1) {
      // If the product is already in the cart, update the quantity
      tourist.cart[cartIndex].quantity += quantity;
    } else {
      // Add the product to the cart
      tourist.cart.push({ productId, quantity });
    }

    // Remove the product from the wishlist
    tourist.wishlist.splice(productIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    res
      .status(200)
      .json({ message: "Product added to cart from wishlist successfully" });
  } catch (error) {
    console.error("Error adding product to cart from wishlist:", error);
    res.status(500).json({
      message:
        "An error occurred while adding the product to the cart from the wishlist",
    });
  }
};

exports.addDeliveryAddress = async (req, res) => {
  try {
    const { touristId, address } = req.body;

    // Find the tourist by ID
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Add the new delivery address to the deliveryAddresses array
    tourist.deliveryAddresses.push(address);

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({ message: "Delivery address added successfully" });
  } catch (error) {
    console.error("Error adding delivery address:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the delivery address" });
  }
};

const processPayment = async (amount, paymentMethodId) => {
  try {
    // Process payment using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
    });

    return paymentIntent;
  } catch (error) {
    throw new Error(error.message);
  }
};
