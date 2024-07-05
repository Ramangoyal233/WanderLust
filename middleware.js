const Listing = require("./models/listing.js");
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("./schema.js");

module.exports.isLogedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login to Create New  Listing");
        return res.redirect("/login")
    }
   next();
};



module.exports.saveRedirectUrl = (req,res,next)   =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
} 

module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
        req.flash("error" , "You don't  hane permission to edit");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing  = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }
}


module.exports. validatereview  = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg2 = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg2)
    }else{
        next();
    }
}

module.exports.isreviewAuthor = async (req,res,next) => {
    let { id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.curUser._id)){
        req.flash("error" , "You are not owner of review");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}