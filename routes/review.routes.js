const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middlewares/middleware.js");
const { createReview, destroyReview } = require("../controllers/review.controllers.js");

const router = express.Router({mergeParams: true});


// Reviews Post Route
router.post("/",isLoggedIn, validateReview, wrapAsync(createReview))

// Reviews Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, destroyReview)


module.exports = router;