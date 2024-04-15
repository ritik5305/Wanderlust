const User = require("../models/user");



module.exports.renderSignup= (req, res) => {
    res.render("users/signup.ejs");
  }



module.exports.signup=async (req, res) => {
    
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.logIn(registeredUser,(err) => {
        if(err){
          return next(err);
        }
        req.flash("success", "User registered successfully!");
        res.redirect("/listings");
      });
  
     
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };


  module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
  }



  module.exports.Login=async (req, res) => {
    req.flash("success","Welcome back the Wanderlust!"); 
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logOut= (req, res,next) => {
    req.logOut((err) => {
      if(err){
        return next(err);
      }
      req.flash("success","you are Logout!");
      res.redirect("/listings");
    });
  }