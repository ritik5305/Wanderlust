const express = require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingschema } = require("../schema.js");



const validatelisting = (req, res, next) => {
  let { error } = listingschema.validate(req.body);
  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMessage); 
  } else {
    next();
  }
};


//index routes.

router.get(
    "/",
    wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("./listings/index.ejs", { allListings });
    })
  );
  
  //New route
  router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
  });
  
  //show routes
  router.get(
    "/:id",
    wrapAsync(async (req, res,next) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("review");
      if(!listing) {
        req.flash("error"," Sorry page not found!");
        res.redirect("/listings");
      }
      res.render("./listings/show.ejs", { listing });
    })
  );


//Create routes

router.post(
  "/",
  validatelisting,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing added successfully!");
    res.redirect("/listings");
  })
);

//Edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error"," Sorry page not found!");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);

//update route
router.put(
  "/:id",
  validatelisting,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","New listing update successfully!");
    res.redirect("/listings");
  })
);

//Delete route

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success"," listing deleted successfully!");
    res.redirect("/listings");
  })
);

module.exports = router;