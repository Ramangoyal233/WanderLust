const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createreview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("sucess", "New Review Created");
   res.redirect(`/listings/${listing.id}`);
   };

   module.exports.deleteReview = async (req, res) => {
    let {id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{ reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess", " Review Deleted");
    res.redirect(`/listings/${id}`);
};