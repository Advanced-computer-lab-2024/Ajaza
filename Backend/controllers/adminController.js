const Admin = require("../models/Admin");
const Advertiser = require("../models/Advertiser");
const Activity = require("../models/Activity");
const Venue = require("../models/venue");
const Itinerary = require("../models/Itinerary");
const Governor = require("../models/Governor");
const Seller = require("../models/Seller");
const Tourist = require("../models/Tourist");
const Guide = require("../models/Guide");
const bcrypt = require("bcrypt");
const Product = require("../models/Product");
const Tag = require("../models/Tag");
const Category = require("../models/Category");
const Img = require("../models/Img");

// Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    const savedAdmin = await admin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update admin by ID
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete admin by ID
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req 17 ng
//admin adds another admin
exports.adminAddAdmin = async (req, res) => {
  const { username, pass } = req.body;

  if (!username || !pass) {
    return res.status(400).json({ message: "Username and pass are required." });
  }

  const saltRounds = 10;
  const hashedPass = await bcrypt.hash(pass, saltRounds);

  try {
    const newadmin = new Admin({ username, pass: hashedPass });
    const savedadmin = await newadmin.save();
    savedadmin.pass = undefined;
    res.status(201).json(savedadmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.adminDeletesAdminFromSystem = async (req, res) => {
  const adminId = req.params.id;
  if (!adminId) {
    return res.status(400).json({ error: "Admin ID is required" });
  }
  try {
    //removing products posted by admin
    const result = await Product.updateMany(
      { adminId: adminId },
      { $set: { hidden: true } }
    );

    //removing category posted by admin and updating activities accordingly
    const result2 = await Category.find({ adminId: adminId });
    const categoriesToRemove = result2.map((category) => category.category);
    let activities = await Activity.find({});
    const filteredActivities = activities.filter((activity) =>
      activity.category.some((category) =>
        categoriesToRemove.includes(category)
      )
    );
    for (let activity of filteredActivities) {
      await Activity.deleteOne({ _id: activity._id });
      /*activity.category = activity.category.filter(
        (cat) => !categoriesToRemove.includes(cat)
      );
      await activity.save();*/
    }
    await Category.deleteMany({ adminId: adminId });

    //removing tags posted by admin and updating activities/itineraries/venues accordingly
    let result3 = await Tag.find({ adminId: adminId });
    let tagsToRemove = result3.map((tag) => tag.tag);

    activities = await Activity.find({});
    for (let activity of activities) {
      activity.tags = activity.tags.filter(
        (tag) => !tagsToRemove.includes(tag)
      );
      await activity.save();
    }
    const venues = await Venue.find({});
    for (let venue of venues) {
      venue.tags = venue.tags.filter((tag) => !tagsToRemove.includes(tag));
      await venue.save();
    }
    const itineraries = await Itinerary.find({});
    for (let itinerary of itineraries) {
      itinerary.tags = itinerary.tags.filter(
        (tag) => !tagsToRemove.includes(tag)
      );
      await itinerary.save();
    }
    await Tag.deleteMany({ adminId: adminId });

    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteImgs = async (req, res) => {
  try {
    await Img.deleteMany({});
    res.status(200).json({ message: "done" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
