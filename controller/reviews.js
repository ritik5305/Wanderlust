const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



module.exports.createReview=async (req, res) => {
    let {id} = req.params 
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  // console.log(newReview);
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New review added successfully!");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  }