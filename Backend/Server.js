const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const examplesRouter = require("./Routes/ExampleRoutes");
app.use("/examples", examplesRouter);

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
