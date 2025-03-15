const mongoose = require("mongoose");
const Review = require("./review.model.js");
const User = require("./user.model.js");
const { required } = require("joi");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  propertyInfo: {
    type: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      default: 0,
    },
    rooms: {
      type: Number,
      required: true,
      default: 0,
    },
    beds: {
      type: Number,
      required: true,
      default: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
