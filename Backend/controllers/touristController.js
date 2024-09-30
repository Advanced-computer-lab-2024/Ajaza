const Tourist = require('../models/Tourist');
const Activity = require('../models/Activity');
const Itinerary = require('../models/Itinerary');
const nodemailer = require('nodemailer');

function isAdult(dob) {
  // Convert the dob string to a Date object
  const birthDate = new Date(dob);
  const today = new Date();

  // Calculate the age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if the birth date hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
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
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update tourist by ID
exports.updateTourist = async (req, res) => {
  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTourist) {
      return res.status(404).json({ message: 'Tourist not found' });
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
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.status(200).json({ message: 'Tourist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// tourist updates his profile req11 TESTED
exports.touristUpdateProfile = async (req, res) => {

  //authentication middleware
  //validation middleware

  const allowedFields = ['email', 'mobile', 'nationality', 'occupation'];

  const filteredBody = Object.keys(req.body)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(req.params.id, filteredBody, { new: true });
    if (!updatedTourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//tourist read profile req11 TESTED
exports.touristReadProfile = async (req, res) => {

  //authentication middleware

  try {
    const touristProfile = await Tourist.findById(req.params.id)
      .select('-pass -activityBookings -itineraryBookings -activityBookmarks -itineraryBookmarks -notifications -totalPoints -wishlist -cart -orders -deliveryAddresses -usedPromoCodes');

    if (!touristProfile) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.status(200).json(touristProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req50 TESTED
exports.emailShare = async (req, res) => {

  //authentication middleware
  //validation middleware

  const {link, email} = req.body;
  const touristId = req.params.id;

  if (!touristId) {
    return res.status(400).json({ message: 'Tourist ID is required' });
  }

  if (!link || !email) {
    return res.status(400).json({ message: 'Bad request' });
  }

  try {
    const tourist = await Tourist.findById(touristId).select('username');

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
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
        html: '<h1>Your friend ' + tourist.username +  ' shared a link with you!</h1> \n\n<a href="' + link + '"><button>Go to link</button></a>',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

    res.status(200).json({ message: 'Email sent'});
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
      return res.status(404).json({ message: 'Activity not found' });
    }

    const now = new Date();
    const hoursDifference = (new Date(activity.date) - now) / (1000 * 60 * 60); // difference in hours

    if (hoursDifference < 48) {
      return res.status(400).json({ message: 'Cannot cancel the activity within 48 hours of its scheduled time.' });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // find the booking for the activity and remove it
    const bookingIndex = tourist.activityBookings.findIndex(
      (booking) => booking.activityId.toString() === activityId
    );

    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Activity booking not found for this tourist.' });
    }

    const totalPaid = tourist.activityBookings[bookingIndex].total;
    tourist.wallet += totalPaid;

    // remove the booking from the tourist activity bookings
    tourist.activityBookings.splice(bookingIndex, 1);

    await tourist.save();

    activity.spots += 1;
    await activity.save();

    res.status(200).json({ message: 'Activity booking canceled successfully' , refund: totalPaid,});
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
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    console.log(tourist.itineraryBookings);
    console.log(itineraryId);

    const bookingIndex = tourist.itineraryBookings.findIndex(
      (booking) => booking.itineraryId.toString() === itineraryId
    );

    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Itinerary booking not found for this tourist.' });
    }

    const itineraryDate = tourist.itineraryBookings[bookingIndex].date;

    const now = new Date();
    const hoursDifference = (new Date(itineraryDate) - now) / (1000 * 60 * 60); // difference in hours

    if (hoursDifference < 48) {
      return res.status(400).json({ message: 'Cannot cancel the itinerary within 48 hours of its scheduled time.' });
    }

    // increasing spots
    const availableDate = itinerary.availableDateTime.find(
      dateEntry => dateEntry.date.toISOString() === itineraryDate.toISOString()
    );

    if (availableDate) {
      availableDate.spots += 1;
    } else {
      return res.status(404).json({ message: 'Available DateTime not found (cannot restore spots)' });
    }
    
    const totalPaid = tourist.itineraryBookings[bookingIndex].total;
    tourist.wallet += totalPaid;

    // remove the booking from the tourist itinerary bookings
    tourist.itineraryBookings.splice(bookingIndex, 1);

    await tourist.save();
    await itinerary.save();

    res.status(200).json({ message: 'Itinerary booking canceled successfully' , refund: totalPaid,});
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
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    if(tourist.points < 10000) {
      return res.status(404).json({ message: 'Not enough points.' });
    }

    const maxRedeemablePoints = Math.floor(tourist.points / 10000) * 100; // For every 10,000 points, redeem $100
    if (maxRedeemablePoints <= 100) {
      return res.status(400).json({ message: 'Not enough points to redeem.' });
    }

    tourist.wallet += maxRedeemablePoints;
    tourist.points -= maxRedeemablePoints * 10000 / 100;

    // Save the updated tourist document
    await tourist.save();

    // Respond with the updated tourist data
    res.status(200).json({
      message: 'Points redeemed successfully!',
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
    const { useWallet, total , promoCode} = req.body; // Boolean to check if wallet should be used for payment, and total passed from frontend

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    if(!isAdult(tourist.dob)) {
      return res.status(400).json({ message: 'Tourist is not an adult' });
    }

    if(promoCode && tourist.usedPromoCodes.includes(promoCode)) {
      return res.status(404).json({ message: 'You already used this promo code' });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // check if the activity is open for booking
    if (!activity.isOpen && activity.spots <= 0) {
      return res.status(400).json({ message: 'This activity is not open for booking' });
    }

    // if the wallet is being used, check if the tourist has enough balance
    if (useWallet) {
      if (tourist.wallet < total) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      
      tourist.wallet -= total;
    }

    // otherwise, deduct the payment from another method (e.g. COD, card), assumed handled elsewhere.

    // deduct 1 spot from the activity
    activity.spots -= 1;

    // Add the booking to the tourist's activityBookings array
    tourist.activityBookings.push({
      activityId: activity._id,
      total: activity.price,
    });

    if(promoCode) {
      tourist.usedPromoCodes.push(promoCode);
    }

    var newPoints;
    switch(tourist.badge) {
      case(1): newPoints = 0.5*total;break;
      case(2): newPoints = total;break;
      case(3): newPoints = 1.5*total;break;
      default: newPoints = 0.5*total;
    }

    tourist.points+=newPoints;
    tourist.totalPoints+=newPoints;

    if(totalPoints > 500000) {
      tourist.badge = 3;
    } else if(totalPoints > 100000) {
      tourist.badge = 2;
    } else {
      tourist.badge = 1;
    }

    // Save both the tourist and activity updates
    await tourist.save();
    await activity.save();

    res.status(200).json({ message: 'Activity booked successfully', tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.bookItinerary = async (req, res) => {
  try {
    const { touristId, itineraryId } = req.params;
    const { useWallet, total, date, promoCode} = req.body; // Boolean to check if wallet should be used for payment, and total passed from frontend

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    if(!isAdult(tourist.dob)) {
      return res.status(400).json({ message: 'Tourist is not an adult' });
    }

    if(promoCode && tourist.usedPromoCodes.includes(promoCode)) {
      return res.status(404).json({ message: 'You already used this promo code' });
    }

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // check if the itinerary is open for booking
    if (!itinerary.active) {
      return res.status(400).json({ message: 'This itinerary is not open for booking' });
    }

    const availableDate = itinerary.availableDates.find(
      (dateObj) => dateObj.date.getTime() === date.getTime()
    );

    if (!availableDate || availableDate.spots <= 0) {
      return res.status(400).json({ message: 'No spots available for this itinerary on the selected date' });
    }

    // check if date is in future and has an availableDateTime === date passed

    // if the wallet is being used, check if the tourist has enough balance
    if (useWallet) {
      if (tourist.wallet < total) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      
      tourist.wallet -= total;
    }

    // otherwise, deduct the payment from another method (e.g. COD, card), assumed handled elsewhere.

    // deduct 1 spot from the itinerary
    availableDate.spots -= 1;

    // add the booking to the tourist's itineraryBookings array
    tourist.itineraryBookings.push({
      itineraryId: itinerary._id,
      date: date,
      total: itinerary.price,
    });

    if(promoCode) {
      tourist.usedPromoCodes.push(promoCode);
    }

    var newPoints;
    switch(tourist.badge) {
      case(1): newPoints = 0.5*total;break;
      case(2): newPoints = total;break;
      case(3): newPoints = 1.5*total;break;
      default: newPoints = 0.5*total;
    }

    tourist.points+=newPoints;
    tourist.totalPoints+=newPoints;

    if(totalPoints > 500000) {
      tourist.badge = 3;
    } else if(totalPoints > 100000) {
      tourist.badge = 2;
    } else {
      tourist.badge = 1;
    }

    // Save both the tourist and itinerary updates
    await tourist.save();
    await itinerary.save();

    res.status(200).json({ message: 'Itinerary booked successfully', tourist });
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
  const allowedFields = ['username', 'email', 'pass','mobile', 'nationality', 'dob', 'occupation'];

  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach(field => { // Loop through the allowed fields
    if (req.body[field] !== undefined) { // Check if the field exists in the request body
      filteredBody[field] = req.body[field]; // Add the field to the filtered body
    }
  });

  try {
    const tourist = new Tourist(filteredBody);
    const savedtourist = await tourist.save();
    res.status(201).json(savedtourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// admin delete tourists requesting deletion
exports.deleteTouristsRequestingDeletion = async (req, res) => {
  try {
    const tourists = await Tourist.find({ requestingDeletion: true });

    if (tourists.length === 0) {
      return res.status(404).json({ message: 'No tourists found requesting deletion' });
    }

    for (const tourist of tourists) {
      await Tourist.findByIdAndDelete(tourist._id);
    }

    res.status(200).json({ message: 'Tourists deleted successfully' });
  } catch (error) {
    console.error('Error deleting tourists:', error);
    res.status(500).json({ error: error.message });
  }
};