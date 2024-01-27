const express = require("express");
const router=express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewschema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
      let errorMessage = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errorMessage);
    } else {
      next();
    }
  };


// post review request
router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
        let {id} = req.params 
      let listing = await Listing.findById(id);
      let newReview = new Review(req.body.review);
      listing.review.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("success","New review added successfully!");
      res.redirect(`/listings/${listing._id}`);
    })
  );
  
  
  //delete  review Route 
  router.delete("/:reviewId",
    wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }));
  
  module.exports =router;