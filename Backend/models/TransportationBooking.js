const mongoose = require("mongoose");

const transportationBookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' },
    transferType: { type: String, default: "PRIVATE" },
    start_dateTime: { type: Date, required: true },
    start_locationCode: { type: String, required: true },
    end_dateTime: { type: Date, required: true },
    end_address_line: { type: String, required: true },
    end_address_cityName: { type: String, required: true },
    vehicle_code: { type: String, required: true },
    vehicle_description: { type: String, required: true },
    vehicle_seats: { type: Number, required: true },
    quotation_monetaryAmount: { type: Number, required: true },
    quotation_currencyCode: { type: String, required: true },
    distance_value: { type: Number, required: true },
    distance_unit: { type: String, required: true },
});

const TransportationBooking = mongoose.model("TransportationBooking", transportationBookingSchema);

module.exports = TransportationBooking;
