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

exports.seeNotifications = async(req,res) => {
  try {
    const userId = req.params.id;

    const user = await Admin.findById(userId);

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

//req 27 - Tatos (Done)
exports.viewSalesReport = async (req, res) => {
  const adminId = req.params.id;
  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const tourists = await Tourist.find({
      $or: [
        { "orders.products.productId": { $exists: true } },
        { "activityBookings.activityId": { $exists: true } },
        { "itineraryBookings.itineraryId": { $exists: true } }
      ]
    })
    .populate('orders.products.productId')
    .populate('activityBookings.activityId')
    .populate('itineraryBookings.itineraryId');

    if (!tourists || tourists.length === 0) {
      return res.status(404).json({ message: "No sales or bookings found" });
    }

    let totalSales = 0;
    let productSales = 0;
    let activityBookingsCommission = 0;
    let itineraryBookingsCommission = 0;
    const report = [];


    // Loop through all tourists
    for (const tourist of tourists) {

      // Calculate total sales from product orders
      for (const order of tourist.orders) {
        for (const product of order.products) {
          const productDetails = product.productId;
          if (productDetails.adminId){  // to fix the internal error issue --> caused by some products not having adminId
            if (productDetails && (productDetails.adminId.toString() === adminId) && (order.status !== "Cancelled")) {
              const productTotal = product.quantity * productDetails.price;
              totalSales += productTotal;
              productSales += productTotal;
              report.push({
                type: 'Product',
                productName: productDetails.name,
                orderDate: order.date,
                quantity: product.quantity,
                price: productDetails.price,
                total: productTotal,
                category: productDetails.category,
              });
              
  
            }
          }
          
        }
      }

      // Calculate 10% commission from activity bookings
      for (const booking of tourist.activityBookings) {
        const activity = booking.activityId;
        if (activity) {
          const commission = booking.total * 0.1;
          activityBookingsCommission += commission;
          totalSales += commission;
          report.push({
            type: 'Activity',
            activityName: activity.name,
            activityDate: activity.date,
            price: booking.total,
            commission: commission,
          });
        }
      }

      // Calculate 10% commission from itinerary bookings
      for (const booking of tourist.itineraryBookings) {
        const itinerary = booking.itineraryId;
        if (itinerary) {
          const commission = booking.total * 0.1;
          itineraryBookingsCommission += commission;
          totalSales += commission;
          report.push({
            type: 'Itinerary',
            itineraryName: itinerary.name,
            bookingDate: booking.date,
            price: booking.total,
            commission: commission,
          });
        }
      }

    }

    res.status(200).json({
      totalSales,
      productSales,
      activityBookingsCommission,
      itineraryBookingsCommission,
      report,
    });


  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
}

// Count Admins by month and year
exports.countAdminsByMonth = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const startOfMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
    const endOfMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0);

    const count = await Admin.countDocuments({
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

