const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require('node-cron');
const Tourist = require('./models/Tourist');
const touristController = require('./controllers/touristController');

const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
const axios = require("axios");
const qs = require("qs");

//const examplesRouter = require("./Routes/ExampleRoutes");
//app.use("/examples", examplesRouter);

const activityRouter = require("./routes/activityRoutes");
const adminRouter = require("./routes/adminRoutes");
const advertiserRouter = require("./routes/advertiserRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const complaintRouter = require("./routes/complaintRoutes");
const governorRouter = require("./routes/governorRoutes");
const guideRouter = require("./routes/guideRoutes");
const itineraryRouter = require("./routes/itineraryRoutes");
const productRouter = require("./routes/productRoutes");
const promoCodeRouter = require("./routes/promoCodeRoutes");
const sellerRouter = require("./routes/sellerRoutes");
const tagRouter = require("./routes/tagRoutes");
const touristRouter = require("./routes/touristRoutes");
const venueRouter = require("./routes/venueRoutes");
const authRouter = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

app.use("/activity", activityRouter);
app.use("/admin", adminRouter);
app.use("/advertiser", advertiserRouter);
app.use("/category", categoryRouter);
app.use("/complaint", complaintRouter);
app.use("/governor", governorRouter);
app.use("/guide", guideRouter);
app.use("/itinerary", itineraryRouter);
app.use("/product", productRouter);
app.use("/promoCode", promoCodeRouter);
app.use("/seller", sellerRouter);
app.use("/tag", tagRouter);
app.use("/tourist", touristRouter);
app.use("/venue", venueRouter);
app.use(cors());
app.use(express.json());

app.use("/activity", activityRouter);
app.use("/admin", adminRouter);
app.use("/advertiser", advertiserRouter);
app.use("/category", categoryRouter);
app.use("/complaint", complaintRouter);
app.use("/governor", governorRouter);
app.use("/guide", guideRouter);
app.use("/itinerary", itineraryRouter);
app.use("/product", productRouter);
app.use("/promoCode", promoCodeRouter);
app.use("/seller", sellerRouter);
app.use("/tag", tagRouter);
app.use("/tourist", touristRouter);
app.use("/venue", venueRouter);
app.use("/api/auth", authRouter);

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
if (!uri) {
  console.error(
    "MongoDB connection URI is not defined. Please set ATLAS_URI in your .env file."
  );
  process.exit(1);
}

mongoose.connect(uri);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});


//first zero is minutes, second zero is hours of when will daily birth checks be held. //change zeroes for testing
cron.schedule('0 0 * * *', () => {
  if (process.env.BIRTHDAYS === 'true') {
    console.log('Running daily birthday check...');
    checkBirthdaysToday();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

async function checkBirthdaysToday() {
  //sign up was saving dob as string, this function will update all dob fields to date. However I changed the sign up to store dob as date so this call may not be needed -AA
  updateDobFields(); 
  try {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;

    const usersWithBirthdayToday = await Tourist.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: '$dob' }, todayDay] },
          { $eq: [{ $month: '$dob' }, todayMonth] }
        ]
      }
    }).select('_id');

    if (usersWithBirthdayToday.length > 0) {
      console.log("Users with birthdays today: ", usersWithBirthdayToday.length);
      await touristController.birthdayEventTriggered(usersWithBirthdayToday);
    } else {
      console.log("No users have birthdays today.");
    }
  } catch (err) {
    console.error("Error finding users with birthdays today:", err);
  }
}


async function updateDobFields() {
  try {
    const touristsWithStringDob = await Tourist.find({ dob: { $type: "string" } });

    if (touristsWithStringDob.length === 0) {
      return;
    }

    for (let tourist of touristsWithStringDob) {
      const dobAsDate = new Date(tourist.dob);

      if (isNaN(dobAsDate.getTime())) {
        //console.log(`Skipping invalid dob for tourist with ID: ${tourist._id}`);
        continue;
      }

      await Tourist.updateOne(
        { _id: tourist._id },
        { $set: { dob: dobAsDate } }
      );
    }

  } catch (error) {
    console.error("Error updating DOB fields:", error);
  }
}

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