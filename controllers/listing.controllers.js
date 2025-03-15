const Listing = require("../models/listing.model.js");
const maptilerClient = require("@maptiler/client");
const Reservation = require("../models/reservation.modal.js");

module.exports.index = async (req, res) => {
  const filter = req.query?.filter;
  const search_query = req.query?.search_query;
  console.log("Filters......", filter, search_query);

  let allListings = [];
  if (filter) {
    allListings = await Listing.find({ "propertyInfo.type": filter });
  } else if (search_query) {
    allListings = await Listing.find({
      $or: [
        { address: { $regex: search_query, $options: "i" } },
        { "propertyInfo.type": { $regex: search_query, $options: "i" } },
      ],
    });
  } else {
    allListings = await Listing.find({});
  }
  console.log(allListings);

  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res, next) => {
  res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }

  const reservation = await Reservation.find({ listing: listing._id });
  console.log(reservation);

  res.render("listings/show.ejs", { listing, reservation });
};

module.exports.createListing = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  maptilerClient.config.apiKey = process.env.MAPTILER_CLIENT_API_KEY;
  const result = await maptilerClient.geocoding.forward(req.body.address);
  console.log(result.features[0].geometry);

  let newListing = new Listing({
    title: req.body.title,
    propertyInfo: {
      type: req.body.type,
      guests: req.body.guests,
      rooms: req.body.rooms,
      beds: req.body.beds,
      bathrooms: req.body.bathrooms,
    },
    description: req.body.description,
    price: req.body.price,
    address: req.body.address,
  });

  newListing.owner = req.user._id;

  req.files?.map((file) => {
    let url = file.path;
    let filename = file.filename;
    newListing.images.push({ url, filename });
  });

  newListing.geometry = result.features[0].geometry;

  const savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New listing created!!");
  res.redirect("/listings");
};

module.exports.renderMyProperties = async (req, res) => {
  let myProperties = await Listing.find({ owner: req.user._id });
  console.log(myProperties);

  res.render("listings/myproperties.ejs", { myProperties });
};

module.exports.renderMyReservations = async (req, res) => {
  let myReservations = await Reservation.find({
    reserver: req.user._id,
  }).populate("listing");

  res.render("listings/reservations.ejs", { myReservations });
};

module.exports.editListingForm = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  maptilerClient.config.apiKey = process.env.MAPTILER_CLIENT_API_KEY;
  const result = await maptilerClient.geocoding.forward(req.body.address);
  console.log(result.features[0].geometry);

  let newListing = {
    title: req.body.title,
    propertyInfo: {
      type: req.body.type,
      guests: req.body.guests,
      rooms: req.body.rooms,
      beds: req.body.beds,
      bathrooms: req.body.bathrooms,
    },
    description: req.body.description,
    price: req.body.price,
    address: req.body.address,
  };

  if (req.files) {
    req.files?.map((file) => {
      let url = file.path;
      let filename = file.filename;
      newListing.images.push({ url, filename });
    });
  }

  newListing.geometry = result.features[0].geometry;

  await Listing.findByIdAndUpdate(id, newListing);

  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  let listingToBeDeleted = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!!");
  res.redirect("/listings");
};

module.exports.reserveListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  // let reservations = await Reservation.find({ listing: listing._id });
  // if (reservations.length >= 1) {
  //   const confirmedReservations = reservations.filter((r) => r.status == "confirmed");
  //   if (confirmedReservations) {
  //     let lastReservationDate = confirmedReservations[confirmedReservations.length - 1]
  //       .reservationDateRange.to;
  //   }
  // }

  const details = new Reservation({
    listing: req.params.id,
    reserver: req.user._id,
    reservationDateRange: {
      from: req.body.from,
      to: req.body.to,
    },
  });

  const reservedListing = await details.save();
  console.log(reservedListing);

  res.redirect("/reservations");
};

module.exports.renderReservedListings = async (req, res, next) => {
  const reservations = await Reservation.find().populate("listing");
  const reservedListings = reservations.filter(
    (reservation) => reservation.listing.owner == req.user._id
  );

  res.render("listings/reservedListings.ejs", { reservedListings });
};

module.exports.DeleteReservedListing = async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    {
      status: "cancelled",
    },
    { new: true }
  );

  req.flash("success", "Reservation cancelled");
  res.redirect("/listings/reserved");
};

module.exports.confirmReservedListing = async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    {
      status: "confirmed",
    },
    { new: true }
  );

  req.flash("success", "Reservation confirmed");
  res.redirect("/listings/reserved");
};
