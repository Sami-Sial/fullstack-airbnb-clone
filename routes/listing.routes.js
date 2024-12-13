const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares/middleware.js");
const { index, renderNewForm, showlisting, createListing, editListingForm, updateListing, destroyListing  } = require("../controllers/listing.controllers.js");
const multer = require("multer");
const {storage} = require("../utils/CloudinaryConfig.js");
const upload = multer({ storage });

const router = express.Router();

// index, create route
router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn, validateListing, upload.single("image"), wrapAsync(createListing))

// new route
router.get("/new", isLoggedIn, renderNewForm)

// show, update, destroy route
router.route("/:id")
.get(wrapAsync(showlisting))
.put(isLoggedIn, isOwner, validateListing, upload.single("image"), wrapAsync(updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(destroyListing))

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListingForm))


module.exports = router;