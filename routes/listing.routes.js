const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middlewares/middleware.js");
const {
  index,
  renderNewForm,
  showlisting,
  createListing,
  editListingForm,
  updateListing,
  renderMyProperties,
  renderMyReservations,
  destroyListing,
  reserveListing,
  renderReservedListings,
  DeleteReservedListing,
  confirmReservedListing,
} = require("../controllers/listing.controllers.js");
const multer = require("multer");
const { storage } = require("../config/CloudinaryConfig.js");
const upload = multer({ storage });

const router = express.Router();

// index, create route
router
  .route("/listings")
  .get(wrapAsync(index))
  .post(isLoggedIn, upload.array("images"), wrapAsync(createListing));

// new route
router.get("/listing/new", isLoggedIn, renderNewForm);

router.get("/listings/me", isLoggedIn, wrapAsync(renderMyProperties));
router.get("/trips/me", isLoggedIn, wrapAsync(renderMyReservations));
router.get(
  "/listings/reserved/me",
  isLoggedIn,
  wrapAsync(renderReservedListings)
);

// show, update, destroy route
router
  .route("/listings/:id")
  .get(wrapAsync(showlisting))
  .put(isLoggedIn, isOwner, upload.array("images"), wrapAsync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

// Edit Route
router.get(
  "/listings/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(editListingForm)
);

router.post("/listing/:id/reserve", isLoggedIn, wrapAsync(reserveListing));
router.get(
  "/listing/:id/reserved/cancel",
  isLoggedIn,
  wrapAsync(DeleteReservedListing)
);
router.get(
  "/listing/:id/reserved/confirm",
  isLoggedIn,
  wrapAsync(confirmReservedListing)
);

module.exports = router;
