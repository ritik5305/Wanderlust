const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    default:
      "https://cdn.pixabay.com/photo/2016/12/06/14/33/log-cabin-1886620_1280.jpg",
    type: String,
    set: (v) =>
      v === ""
        ? "https://cdn.pixabay.com/photo/2016/12/06/14/33/log-cabin-1886620_1280.jpg"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
   await Review.deleteMany({_id:{$in: listing.review}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
