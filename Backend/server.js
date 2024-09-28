const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require('nodemailer');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

//const examplesRouter = require("./Routes/ExampleRoutes");
//app.use("/examples", examplesRouter);

const activityRouter = require('./routes/activityRoutes');
const adminRouter = require('./routes/adminRoutes');
const advertiserRouter = require('./routes/advertiserRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const complaintRouter = require('./routes/complaintRoutes');
const governorRouter = require('./routes/governorRoutes');
const guideRouter = require('./routes/guideRoutes');
const itineraryRouter = require('./routes/itineraryRoutes');
const productRouter = require('./routes/productRoutes');
const promoCodeRouter = require('./routes/promoCodeRoutes');
const sellerRouter = require('./routes/sellerRoutes');
const tagRouter = require('./routes/tagRoutes');
const touristRouter = require('./routes/touristRoutes');
const venueRouter = require('./routes/venueRoutes');

app.use('/activity', activityRouter);
app.use('/admin', adminRouter);
app.use('/advertiser', advertiserRouter);
app.use('/category', categoryRouter);
app.use('/complaint', complaintRouter);
app.use('/governor', governorRouter);
app.use('/guide', guideRouter);
app.use('/itinerary', itineraryRouter);
app.use('/product', productRouter);
app.use('/promoCode', promoCodeRouter);
app.use('/seller', sellerRouter);
app.use('/tag', tagRouter);
app.use('/tourist', touristRouter);
app.use('/venue', venueRouter);

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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});