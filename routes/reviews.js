const express = require("express") ;
const router = express.Router({mergeParams : true}) ;
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js") ;
const Review = require("../models/reviews.js") ;
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const { postReview, deleteReview } = require("../controllers/reviews.js");


//Post Review Route 
router.post("/" , isLoggedIn, validateReview , wrapAsync(postReview)) ;

//Delete Review Route 
router.delete("/:reviewId" , isLoggedIn , isAuthor , wrapAsync(deleteReview)) 

module.exports = router ;