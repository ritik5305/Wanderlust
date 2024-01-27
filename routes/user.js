const express = require("express");
const router=express.Router();
const User = express("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

// router.post("/signup", async(req,res)=>{
  
//     let {username, email, password} = req.body;
//     console.log(username,email,password);
//     try{
//       const newUser = new User({username, email});
//       const registeredUser = await User.register(newUser,password);
//       console.log(registeredUser);
//     }catch(err){
//       console.log(err);

//     };
    
  
//     req.flash("success"," User registered Successfully!"); 
//     res.redirect("/listings");
//   });


router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (error) => {
        if (error) {
          return next(new ExpressError(400, "Failed to login!"));
        }
        req.flash("success", `Welcome to Wanderlust ${username}`);
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

module.exports = router;