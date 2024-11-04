const mongoose = require("mongoose");

const transportationBookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' },
    
});

// Create the model
const TransportationBooking = mongoose.model("TransportationBooking", transportationBookingSchema);

module.exports = TransportationBooking;
