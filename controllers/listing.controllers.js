const Listing = require("../models/listing.model.js");
const maptilerClient = require("@maptiler/client");


module.exports.index = async (req,res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res,next) => {
    res.render("listings/new.ejs");
}

module.exports.showlisting = async(req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}})
    .populate("owner")
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    maptilerClient.config.apiKey = process.env.MAPTILER_CLIENT_API_KEY;
    const result = await maptilerClient.geocoding.forward(req.body.location);
    console.log(result.features[0].geometry);

    let newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = result.features[0].geometry;

    await newListing.save();
    req.flash("success", "New listing created!!");
    res.redirect("/listings");
}

module.exports.editListingForm = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body);

    if(typeof req.file !== "undefined") {
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image = {url,filename};
       await listing.save();
    }

    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res,next) => {
    let {id} = req.params;
    let listingToBeDeleted = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!!");
    res.redirect("/listings");
}