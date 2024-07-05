const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const  { validatereview, isLogedIn,  isreviewAuthor } = require("../middleware.js")
const Review = require("../models/review.js");
const  Listing = require("../models/listing.js");
const reviewController = require("../controllers/review.js");   


//post review route

router.post("/" ,isLogedIn, validatereview, wrapAsync(reviewController.createreview));
   
// post delete route

router.delete("/:reviewId",isLogedIn,isreviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;