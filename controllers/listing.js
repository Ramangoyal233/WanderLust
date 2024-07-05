
const { query } = require("express");
const  Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
};

module.exports.renderNewForm = (req  , res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let{ id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested not exist");
      res.redirect("/listings")
    }else{
    res.render("listings/show.ejs", { listing });}
};

module.exports.creataListing = async (req , res, next) => {
   let coordinates = await geocodingClient
   .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
   })
   .send();

    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    newlisting.geometry = coordinates.body.features[0].geometry;
    let savedListing = await newlisting.save();
    console.log(savedListing);
    req.flash("sucess", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditform = async (req , res) => {
    let{ id} = req.params;
      let listing = await Listing.findById(id);
      if(!listing){
        req.flash("error","Listing you requested not exist");
        return res.redirect("/listings")
      }

      let OrginalImageUrl = listing.image.url;
      OrginalImageUrl = OrginalImageUrl.replace("/upload", "/upload/h_250,w_300");
      res.render("listings/edit.ejs" ,{ listing, OrginalImageUrl })
};

module.exports.updateListing =  async (req , res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
   
   if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
      await listing.save();}
    req.flash("sucess", "Listing Updated");
    res.redirect(`/listings/${id}`);
};



module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("sucess", "Listing Deleted");
    res.redirect("/listings");
};