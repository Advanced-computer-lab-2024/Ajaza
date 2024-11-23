const Tourist = require("../models/Tourist");
const Activity = require("../models/Activity");
const Itinerary = require("../models/Itinerary");
const Guide = require("../models/Guide");
const Product = require("../models/Product");
const Admin = require("../models/Admin");
const Seller = require("../models/Seller");
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

    transporter
      .sendMail(mailOptions)
      .then((info) => console.log("Email sent: ", info.response))
      .catch((error) => console.error("Error sending email: ", error));

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
      console.log("activityId", activityId);
      return res.status(404).json({ message: "Activity not found" });
    }

    const now = new Date();
    const hoursDifference = (new Date(activity.date) - now) / (1000 * 60 * 60); // difference in hours

    if (hoursDifference < 48) {
      console.log("cannot cancel within 48 hours");
      return res.status(400).json({
        message:
          "Cannot cancel the activity within 48 hours of its scheduled time.",
      });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      console.log("touristId", touristId);
      return res.status(404).json({ message: "Tourist not found" });
    }

    // find the booking for the activity and remove it
    const bookingIndex = tourist.activityBookings.findIndex(
      (booking) => booking.activityId.toString() === activityId
    );

    if (bookingIndex === -1) {
      console.log("no booking found");
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

    console.log("booking cancelled");
    res.status(200).json({
      message: `Activity booking canceled successfully, refund: ${totalPaid}USD. Current wallet balance: ${tourist.wallet}`,
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
      console.log("iten id", itineraryId);
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      console.log("touristId", touristId);
      return res.status(404).json({ message: "Tourist not found" });
    }

    const bookingIndex = tourist.itineraryBookings.findIndex(
      (booking) => booking.itineraryId.toString() === itineraryId
    );

    if (bookingIndex === -1) {
      console.log("no booking found");
      return res
        .status(404)
        .json({ message: "Itinerary booking not found for this tourist." });
    }

    const itineraryDate = tourist.itineraryBookings[bookingIndex].date;

    const now = new Date();
    const hoursDifference = (new Date(itineraryDate) - now) / (1000 * 60 * 60); // difference in hours

    if (hoursDifference < 48) {
      console.log("cannot cancel within 48 hours");
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
      console.log("no available date found");
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
    console.log("booking cancelled");
    res.status(200).json({
      message: `Itinerary booking canceled successfully, refund: ${totalPaid}USD. Current wallet balance: ${tourist.wallet}`,
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
      message:
        "Points redeemed successfully!" +
        maxRedeemablePoints +
        " added to wallet",
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
      console.log("touristId", touristId);
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (!isAdult(tourist.dob)) {
      console.log("not adult");
      return res.status(418).json({ message: "Tourist is not an adult" });
    }

    //this condition may be commented since handling it in the frontend
    if (promoCode && tourist.usedPromoCodes.includes(promoCode)) {
      console.log("promo code already used");
      return res
        .status(404)
        .json({ message: "You already used this promo code" });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      console.log("activityId", activityId);
      return res.status(404).json({ message: "Activity not found" });
    }

    // check if the activity is open for booking
    if (!activity.isOpen || activity.spots <= 0) {
      console.log("activity not open");
      return res
        .status(400)
        .json({ message: "This activity is not open for booking" });
    }

    // if the wallet is being used, check if the tourist has enough balance
    if (useWallet) {
      if (tourist.wallet < total) {
        console.log("insufficient wallet balance");
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
        console.log("payment failed");
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

    console.log("activity booked");
    res.status(200).json({ message: "Activity booked successfully", tourist });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

exports.bookItinerary = async (req, res) => {
  try {
    const { touristId, itineraryId } = req.params;
    const { useWallet, total, date, promoCode, paymentMethodId } = req.body; // Boolean to check if wallet should be used for payment, and total passed from frontend

    if (!date || !total) {
      console.log("date and total required");
      return res.status(400).json({ message: "Date and total are required" });
    }

    if (date < new Date()) {
      console.log("date must be in the future");
      return res.status(400).json({ message: "Date must be in the future" });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      console.log("touristId", touristId);
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (!isAdult(tourist.dob)) {
      console.log("not adult");
      return res.status(400).json({ message: "Tourist is not an adult" });
    }

    //unnecessary condition
    if (promoCode && tourist.usedPromoCodes.includes(promoCode)) {
      console.log("promo code already used");
      return res
        .status(404)
        .json({ message: "You already used this promo code" });
    }

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      console.log("itineraryId", itineraryId);
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // check if the itinerary is open for booking
    if (!itinerary.active) {
      console.log("itinerary not open");
      return res
        .status(400)
        .json({ message: "This itinerary is not open for booking" });
    }
    const factoredDate = new Date(date);

    const availableDate = itinerary.availableDateTime.find(
      (dateObj) => dateObj.date.getTime() === factoredDate.getTime()
    );

    if (!availableDate || availableDate.spots <= 0) {
      console.log("no spots available");
      return res.status(400).json({
        message: "No spots available for this itinerary on the selected date",
      });
    }

    // check if date is in future and has an availableDateTime === date passed

    // if the wallet is being used, check if the tourist has enough balance
    if (useWallet && useWallet === true) {
      if (tourist.wallet < total) {
        console.log("insufficient wallet balance");
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

    console.log("itinerary booked");
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
      return res.status(404).json({ message: "not found" });
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
      return res.status(404).json({ message: "Tourist not found" });
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
      if (
        tourist.itineraryBookings[i].date < currentDate &&
        tourist.itineraryBookings[i].itineraryId
      ) {
        itineraries.push({
          itineraryId: tourist.itineraryBookings[i].itineraryId._id,
          name: tourist.itineraryBookings[i].itineraryId.name,
          date: tourist.itineraryBookings[i].date,
          gaveFeedback: tourist.gaveFeedback.includes(
            tourist.itineraryBookings[i].itineraryId._id
          ),
        });
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

        const guideName = await Guide.findById(
          tourist.itineraryBookings[i].itineraryId.guideId
        ).select("username");
        if (guideName && !guideNames.includes(guideName.username)) {
          guides.push({
            guideId: tourist.itineraryBookings[i].itineraryId.guideId,
            name: guideName.username,
            gaveFeedback: tourist.gaveFeedback.includes(
              tourist.itineraryBookings[i].itineraryId.guideId
            ),
            //gaveFeedback: numberOfBookingsWithGuide < guideNumberOfTimesRated,
          });
          guideNames.push(guideName.username);
        }
      }
    }

    let products = [];
    for (let i = 0; i < tourist.orders.length; i++) {
      if (
        tourist.orders[i].date < currentDate &&
        tourist.orders[i].status != "Cancelled"
      ) {
        for (let j = 0; j < tourist.orders[i].products.length; j++) {
          products.push({
            productId: tourist.orders[i].products[j].productId._id,
            name: tourist.orders[i].products[j].productId.name,
            sellerName: tourist.orders[i].products[j].productId.sellerName,
            date: tourist.orders[i].date,
            gaveFeedback: tourist.gaveFeedback.includes(
              tourist.orders[i].products[j].productId._id
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
  }
};

exports.getHistoryFull = async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id)
      .populate("activityBookings.activityId")
      .populate("itineraryBookings.itineraryId")
      .populate("orders.products.productId");

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const currentDate = new Date();
    let activities = [];
    for (let i = 0; i < tourist.activityBookings.length; i++) {
      if (tourist.activityBookings[i].activityId.date < currentDate) {
        activities.push(tourist.activityBookings[i].activityId);
      }
    }
    let itineraries = [];
    let guides = [];
    for (let i = 0; i < tourist.itineraryBookings.length; i++) {
      if (
        tourist.itineraryBookings[i].date < currentDate &&
        tourist.itineraryBookings[i].itineraryId
      ) {
        itineraries.push(tourist.itineraryBookings[i].itineraryId);
      }
    }

    // let products = [];
    // for (let i = 0; i < tourist.orders.length; i++) {
    //   if (
    //     tourist.orders[i].date < currentDate &&
    //     tourist.orders[i].status != "Cancelled"
    //   ) {
    //     for (let j = 0; j < tourist.orders[i].products.length; j++) {
    //       products.push(tourist.orders[i].products[j].productId);
    //     }
    //   }
    // }
    //66f6ae2a0f0094718a1f7d82 some product id to test
    res.status(200).json({
      activities: activities,
      itineraries: itineraries,
      // guides: guides,
      // products: products,
    });
  } catch (error) {
    console.error("Error retrieving past activity bookings:", error);
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
  const touristId = req.params.id;
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
        if (tourist.activityBookings[i].activityId) {
          activities.push({
            activityId: tourist.activityBookings[i].activityId._id,
            name: tourist.activityBookings[i].activityId.name,
            date: tourist.activityBookings[i].activityId.date,
            canBeCancelled: hoursDifference > 48,
          });
          ``;
        }
      }
    }
    let itineraries = [];
    for (let i = 0; i < tourist.itineraryBookings.length; i++) {
      if (tourist.itineraryBookings[i].date > currentDate) {
        const hoursDifference =
          (new Date(tourist.itineraryBookings[i].date) - currentDate) /
          (1000 * 60 * 60);
        if (tourist.itineraryBookings[i].itineraryId) {
          itineraries.push({
            itineraryId: tourist.itineraryBookings[i].itineraryId._id,
            name: tourist.itineraryBookings[i].itineraryId.name,
            date: tourist.itineraryBookings[i].date,
            canBeCancelled: hoursDifference > 48,
          });
        }
      }
    }

    res.status(200).json({ activities: activities, itineraries: itineraries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//req67
exports.addActivityBells = async (req, res) => {
  const { touristId, activityId } = req.params;
  //cleanActivityBells(touristId);

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (!tourist.activityBells.includes(activityId)) {
      tourist.activityBells.push(activityId);
    } else {
      return res.status(400).json({ message: "Activity already marked" });
    }

    await tourist.save();

    res.status(200).json({ message: "Activity marked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function cleanActivityBells(touristId) {
  const tourist = await Tourist.findById(touristId);
  const activityBells = tourist.activityBells;

  const currentDate = new Date();
  for (let i = 0; i < activityBells.length; i++) {
    const activity = await Activity.findById(activityBells[i]);
    if (!activity) {
      activityBells.splice(i, 1);
      i--;
    } else {
      if (activity.date < currentDate) {
        activityBells.splice(i, 1);
        i--;
      } else {
        if (activity.hidden) {
          activityBells.splice(i, 1);
          i--;
        }
      }
    }
  }

  tourist.activityBells = activityBells;
  await tourist.save();
}

exports.removeActivityBells = async (req, res) => {
  const { touristId, activityId } = req.params;

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const activityIndex = tourist.activityBells.findIndex(
      (bell) => bell.toString() === activityId
    );

    if (activityIndex === -1) {
      return res.status(404).json({ message: "Activity not marked" });
    }

    tourist.activityBells.splice(activityIndex, 1);
    await tourist.save();
    
    res.status(200).json({ message: "Activity unmarked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addItineraryBells = async (req, res) => {
  const { touristId, itineraryId } = req.params;
  //cleanItineraryBells(touristId);

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (!tourist.itineraryBells.includes(itineraryId)) {
      tourist.itineraryBells.push(itineraryId);
    } else {
      return res
        .status(400)
        .json({ message: "Itinerary already marked" });
    }

    await tourist.save();

    res.status(200).json({ message: "Itinerary marked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function cleanItineraryBells(touristId) {
  const tourist = await Tourist.findById(touristId);
  const itineraryBells = tourist.itineraryBells;

  for (let i = 0; i < itineraryBells.length; i++) {
    const itinerary = await Itinerary.findById(itineraryBells[i]);
    if (!itinerary) {
      itineraryBells.splice(i, 1);
      i--;
    } else {
      if (itinerary.hidden) {
        itineraryBells.splice(i, 1);
        i--;
      }
    }
  }
  tourist.itineraryBells = itineraryBells;
  await tourist.save();
}

exports.removeItineraryBells = async (req, res) => {
  const { touristId, itineraryId } = req.params;

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const itineraryIndex = tourist.itineraryBells.findIndex(
      (bell) => bell.toString() === itineraryId
    );

    if (itineraryIndex === -1) {
      return res.status(404).json({ message: "Itinerary not marked" });
    }

    tourist.itineraryBells.splice(itineraryIndex, 1);
    await tourist.save();

    res.status(200).json({ message: "Itinerary unmarked successfully" });
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
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (!tourist.activityBookmarks.includes(activityId)) {
      tourist.activityBookmarks.push(activityId);
    } else {
      return res.status(400).json({ message: "Activity already bookmarked" });
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

exports.removeActivityBookmark = async (req, res) => {
  try {
    const touristId = req.params.id;
    const activityIdToRemove = req.body.activityId;

    const tourist = await Tourist.findById(touristId);

    if(!tourist) {
      return res.status(404).json({ message: "Tourist not found"});
    }

    tourist.activityBookmarks = tourist.activityBookmarks.filter(
      (activityId) => activityId.toString() !== activityIdToRemove.toString()
    );

    tourist.save();

    return res.status(200).json({message: "Bookmark removed successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Network error" });
  }
}

exports.removeItineraryBookmark = async (req, res) => {
  try {
    const touristId = req.params.id;
    const itineraryIdToRemove = req.body.itineraryId;

    const tourist = await Tourist.findById(touristId);

    if(!tourist) {
      return res.status(404).json({ message: "Tourist not found"});
    }

    tourist.itineraryBookmarks = tourist.itineraryBookmarks.filter(
      (itineraryId) => itineraryId.toString() !== itineraryIdToRemove.toString()
    );

    tourist.save();

    return res.status(200).json({message: "Bookmark removed successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Network error" });
  }
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
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (!tourist.itineraryBookmarks.includes(itineraryId)) {
      tourist.itineraryBookmarks.push(itineraryId);
    } else {
      return res
        .status(400)
        .json({ message: "Itinerary already bookmarked" });
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

exports.addDeliveryAddressO = async (req, res) => {
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

// req66
exports.getSavedEvents = async (req, res) => {
  try {
    const touristId = req.params.id;

    const tourist = await Tourist.findById(touristId)
      .populate("activityBookmarks")
      .populate("itineraryBookmarks");
    if (!tourist) {
      console.log("Tourist not found");
      return res.status(404).json({ message: "Tourist not found" });
    }

    let activities = tourist.activityBookmarks;
    let itineraries = tourist.itineraryBookmarks;
    console.log("yemken", activities, itineraries);

    res.status(200).json({ activities: activities, itineraries: itineraries });
  } catch (error) {
    console.error("Error retrieving saved events:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the saved events" });
  }
}

exports.saveEvent = async (req,res) => {
  try {

    const touristId = req.params.id;
    const { activityId, itineraryId } = req.body;

    const tourist = await Tourist.findById(touristId);

    if(!tourist) {
      return res.status(404).json({error: "Tourist not Found"});
    }

    if(activityId && !tourist.activityBookmarks.includes(activityId)) {
      tourist.activityBookmarks.push(activityId);
      await tourist.save();
      return res.status(200).json({message: "Activity Bookmarked successfully"});
    }

    if(itineraryId && !tourist.itineraryBookmarks.includes(itineraryId)) {
      tourist.itineraryBookmarks.push(itineraryId);
      await tourist.save();
      return res.status(200).json({message: "Itinerary Bookmarked successfully"});
    }
    
    return res.status(500).json({error: "Missing params"});

  } catch(error) {
    return res.status(500).json({error: "Internal error"});
  }
}

exports.getOrders = async (req, res) => {
  try {
    const touristId = req.params.id;

    const tourist = await Tourist.findById(touristId)
      .populate({
        path: 'orders.products.productId'
      });

    if(!tourist) {
      return res.status(404).json({error: "Tourist not Found"});
    }

    return res.status(200).json(tourist.orders);
  } catch (error) {
    return res.status(500).json({error: "Internal error"});
  }
}

exports.getOrder = async (req, res) => {
  try {
    const touristId = req.params.id;

    const tourist = await Tourist.findById(touristId)
      .populate({
        path: 'orders.products.productId'
      });
    
    if(!tourist) {
      return res.status(404).json({error: "Tourist not Found"});
    }

    const orderId = req.body.orderId;

    const order = tourist.orders.id(orderId);

    if (!order) {
      res.status(404).json({message: "Order not Found"});
    }

    return res.status(200).json(order);
  } catch (error) {
    res.status(500).json({error: "Internal error"});
  }
}

exports.cancelOrder = async (req, res) => {
  try {
    const touristId = req.params.id;
    const orderId = req.body.orderId;

    const order = tourist.orders.id(orderId);

    if (!order) {
      return res.status(404).json({message: "Order not Found"});
    }

    const tourist = await Tourist.findById(touristId);

    if(!tourist) {
      return res.status(404).json({message: "Tourist not Found"});
    }

    for (const item of order.products) {
      const product = await Product.findById(item.productId);

      if (product) {
        product.quantity += item.quantity;
        product.sales -= item.quantity*product.price;
        await product.save();
      }
    }

    order.status = "Cancelled";
    tourist.wallet += order.total;
    await tourist.save();
    return res.status(200).json({message: "Order cancelled successfully"});
  } catch (error) {
    res.status(500).json({message: "Internal error"});
  }
}

exports.addDeliveryAddress = async(req, res) => {
  try {
    const touristId = req.params.id;
    const { country, city, area, street, house, app, desc } = req.body;

    if(!country || !city || !area || !street || !house || !app) {
      console.log("missing");
      return res.status(400).json({message: "Missing params"});
    }
    const address = { country, city, area, street, house, app, desc };

    const tourist = await Tourist.findById(touristId);

    if(!tourist) {
      console.log("not found");
      return res.status(404).json({message: "Tourist not Found"});
    }

    tourist.deliveryAddresses.push(address);
    await tourist.save();

    const token = jwt.sign(
      {
        userId: tourist._id,
        role: "tourist",
        userDetails: tourist,
      }, // Include user data in the token
      process.env.JWT_SECRET, // Use the environment variable
      { expiresIn: "1h" }
    );

    return res.status(200).json({message: "Address added successfully", token});
  } catch (error) {
    console.log("error");
    res.status(500).json({message: "Internal error"});
  }
}

exports.addProductToCart = async (req,res) => {
  try {
    const touristId = req.params.id;
    const productId = req.body.productId;

    if(!productId) {
      return res.status(404).json({message: "Product not Found"});
    }

    const tourist = await Tourist.findById(touristId);

    if(!tourist) {
      return res.status(404).json({message: "Tourist not Found"});
    }

    refreshCart(touristId);

    if(!tourist.cart.some((item) => item.productId.toString() === productId.toString())) {
      tourist.cart.push({productId, quantity:1});
      await tourist.save();
    } else {
      return res.status(400).json({message: "Product already in cart"});
    }
    return res.status(200).json({message: "Product added to cart successfully"});
  } catch(error) {
    return res.status(500).json({message: "Internal error"});
  }
}

exports.changeQuantityInCart = async(req,res) => {
  try {
    const touristId = req.params.id;
    const { productId, quantity } = req.body;

    if(!productId || !quantity) {
      return res.status(400).json({message: "Missing params"});
    }

    const tourist = await Tourist.findById(touristId);

    if(!tourist) {
      return res.status(404).json({message: "Tourist not Found"});
    }

    refreshCart(touristId);

    const result = await Tourist.findOneAndUpdate(
      { _id: touristId, "cart.productId": productId }, 
      { $set: { "cart.$[elem].quantity": quantity } }, 
      {
        arrayFilters: [{ "elem.productId": productId }],
        new: true,
      }
    );

    if (!result) {
      return res.status(404).json({message: "Error has occurred, Cart refreshed"});
    }

    return res.status(200).json({message: "Quantity updated successfully"});
  } catch (error) {
    return res.status(500).json({message: "Internal error"});
  }
}

//helper
async function refreshCart(touristId) {
  try {
    const tourist = await Tourist.findById(touristId).populate('cart.productId');

    if (!tourist) {
      return { error: "Tourist not found." };
    }

    const validCart = tourist.cart.filter((item) => {
      const product = item.productId;
      return product && !product.archived && !product.hidden;
    });

    tourist.cart = validCart;
    await tourist.save();

    return { message: "Cart refreshed successfully.", cart: tourist.cart };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while refreshing the cart." };
  }
}

exports.removeFromCart = async(req,res) => {
  try {

    const touristId = req.params.id;
    const productId = req.body.productId

    const tourist = await Tourist.findById(touristId);

    refreshCart(touristId);

    if(!tourist) {
      return res.status(404).json({message: "Tourist not found"});
    }

    const result = await Tourist.findByIdAndUpdate(
      touristId,
      { $pull: { cart: { productId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({message: "Tourist not found"});
    }

    await tourist.save();

    return res.status(200).json({message: "Product removed from cart successfully"});
  } catch(error) {
    return res.status(500).json({message: "Internal error"});
  }
}

exports.allReminders = async () => {
  try {

    const tourists = await Tourist.find();

    for(let i = 0; i < tourists.length;i++) {
      reminders(tourists[i]._id);
    }

    return res.status(200).json({message: "Reminders for all tourists sent successfully"});

  } catch(error) {
    return res.status(500).json({message: "Internal error"});
  }
}

async function reminders(touristId) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

    const tourist = await Tourist.findById(touristId)
      .populate({
        path: "activityBookings.activityId",
        select: "date name", 
      })
      .populate({
        path: "itineraryBookings.itineraryId",
        select: "name", 
      });

    if (!tourist) {
      return res.status(404).json({message: "Tourist not found"});
    }

    const activityEvents = tourist.activityBookings.filter(booking => {
      const activityDate = booking.activityId?.date;
      return activityDate >= startOfDay && activityDate <= endOfDay;
    });

    const itineraryEvents = tourist.itineraryBookings.filter(booking => {
      return booking.date >= startOfDay && booking.date <= endOfDay;
    });

    for(let i = 0; i< activityEvents.length; i++) {
      tourist.notifications.push({text: (activityEvents[i].activityId?.name  + "reminder: You have a booking tomorrow!"), seen: false, activityId: activityEvents[i].activityId?._id})
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
        subject: "Reminder",
        html:
          "<h2>" +
          (activityEvents[i].activityId?.name  + "reminder: You have a booking tomorrow!") +
          "</h2>",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
        }
      });
    }

    for(let i = 0; i< itineraryEvents.length; i++) {
      tourist.notifications.push({text: (itineraryEvents[i].itineraryId?.name  + "reminder: You have a booking tomorrow!"), seen: false, itineraryId: itineraryEvents[i].itineraryId?._id})
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
        subject: "Reminder!",
        html:
          "<h2>" +
          (itineraryEvents[i].itineraryId?.name  + "reminder: You have a booking tomorrow!") +
          "</h2>",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
        }
      });
    }

    await tourist.save();
    return res.status(200).json({message: "Reminders sent successfully"});

  } catch(error) {
    return res.status(500).json({message: "Internal error"});
  }
}

exports.checkout = async(req,res) => {
  try {
    const touristId = req.params.id;
    const { useWallet, cod } = req.body;

    const tourist = await Tourist.findOne({ _id: touristId }).populate('cart.productId');

    refreshCart(touristId);

    if(!tourist || tourist.cart.length <= 0) {
      return res.status(400).json({message: "Cart refreshed, cart is now empty: cannot place order"});
    }

    const validCartItems = [];
    const invalidCartItems = [];
    
    for (const item of tourist.cart) {
      const product = item.productId;

      if (product.quantity >= item.quantity) {
        validCartItems.push(item);
      } else {
        invalidCartItems.push({
          productId: product._id,
          availableQuantity: product.quantity,
          requestedQuantity: item.quantity,
        });
      }
    }

    if (invalidCartItems.length > 0 || validCartItems.length <= 0) {
      return res.status(400).json({message: "Invalid quantities", invalidCartItems});
    }

    const total = validCartItems.reduce((acc, item) => {
      const productPrice = item.productId.price;
      return acc + productPrice * item.quantity;
    }, 0);

    if(useWallet === true) {
      if(tourist.wallet > total) {
        tourist.wallet -= total;
      } else {
        return res.status(400).json({message: "Insufficient funds"});
      }
    } else {
      console.log("handling swipe payment"); //TODO
    }

    const order = {
      products: validCartItems.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      date: new Date(),
      cod: cod,
      total,
      status: "Processing",
    };

    tourist.orders.push(order);

    for (const item of validCartItems) {
      const product = item.productId;
      product.quantity -= item.quantity;
      if(product.quantity == 0) {
        outOfStock(product.name, product.sellerId, product.adminId);
      }
      await product.save();
    }

    tourist.cart = [];

    await tourist.save();

    return { message: "Order created successfully!", order };
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Internal error"});
  }
}

async function outOfStock(name, sellerId, adminId) {
  try {
    if(sellerId) {
      const seller = await Seller.findById(sellerId);

      seller.notifications.push({text: `Your product ${name} is out of stock`, seen: false});

      seller.save();
    } else if(adminId) {
      const admin = await Admin.findById(adminId);

      admin.notifications.push({text: `Your product ${name} is out of stock`, seen: false});

      admin.save();
    } else {
      return;
    }

    return { message: "Notification sent successfully." };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while sending notification." };
  }
}

exports.seeNotifications = async(req,res) => {
  try {
    const userId = req.params.id;

    const user = await Tourist.findById(userId);

    if(!user) {
      return res.status(404).json({message: "User not found"});
    }

    for(let i = 0; i < user.notifications.length; i++) {
      user.notifications[i].seen = true;
    }

    await user.save();

    return res.status(200).json({message: "Notifications seen successfully"});
  }
  catch(error) {
    return res.status(500).json({message: "Internal error"});
  }
}
;
