const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLogedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLogedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.creataListing));

//Create new listing
router.get("/new",isLogedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLogedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLogedIn,isOwner,wrapAsync(listingController.deleteListing))

//edit route

router.get("/:id/edit" ,isLogedIn,isOwner,wrapAsync(listingController.renderEditform ));

 module.exports = router;