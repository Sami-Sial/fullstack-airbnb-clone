const Listing = require("../models/listing.model.js");
const Review = require("../models/review.model.js");
const { joiListingValidationSchema, joiReviewValidationSchema, joiUserValidationSchema } = require("../utils/schemaValidation.js");
const ExpressError = require("../utils/expressError.js");

module.exports.validateListing = (req, res, next) => {
    let {error} = joiListingValidationSchema.validate(req.body);
    console.log(error);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req,res,next) => {
    let {error} = joiReviewValidationSchema.validate(req.body);
    console.log(error);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateUser = (req,res,next) => {
    let {error} = joiUserValidationSchema.validate(req.body);
    console.log(error);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id == res.locals.currUser._id){
        req.flash("error", " You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id == res.locals.currUser._id){
        req.flash("error", " You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
