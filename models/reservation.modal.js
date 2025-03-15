const mongoose = require("mongoose");
const Listing = require("./listing.model.js");
const User = require("./user.model.js");

const reserveListingSchema = new mongoose.Schema({
  reserver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  reservedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  reservationDateRange: {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
});

const Reservation = mongoose.model("Reservation", reserveListingSchema);

module.exports = Reservation;
