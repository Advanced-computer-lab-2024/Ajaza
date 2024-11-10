const mongoose = require("mongoose");

const transportationBookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' },
    transferType: { type: String, default: "PRIVATE" },
    start_dateTime: { type: String, required: false },
    start_locationCode: { type: String, required: false },
    end_dateTime: { type: String, required: false },
    end_address_line: { type: String, required: false },
    end_address_cityName: { type: String, required: false },
    vehicle_code: { type: String, required: false },
    vehicle_description: { type: String, required: false },
    vehicle_seats: { type: String, required: false },
    quotation_monetaryAmount: { type: String, required: false },
    quotation_currencyCode: { type: String, required: false },
    distance_value: { type: String, required: false },
    distance_unit: { type: String, required: false },
});

const TransportationBooking = mongoose.model("TransportationBooking", transportationBookingSchema);

module.exports = TransportationBooking;
