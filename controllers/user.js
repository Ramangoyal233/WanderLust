const User = require("../models/user");

module.exports.renderSignForm = (req, res) => {
    res.render("user/signup.ejs")
};

module.exports.signup = async (req,res) => {
    
    try{
        
    let {username, email, password} = req.body;
    let newUser = new User({email, username});
    let registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
        if(err){
            return next(err);
        }
        req.flash("sucess" , "Welcome To wanderLust");
     res.redirect("/listings")
    })
     
    } catch (e) { 
        req.flash("error", e.message )
        res.redirect("/signup")
     }

};

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs")
};

module.exports.Login =  ( req,res) => {
    req.flash("sucess" , "Welcome back to WanderLust")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

  module.exports.logout = (req,res,next) =>   {
    req.logOut((err) => {
        if(err){
            next(err)
        }
        req.flash("sucess" , "You Logout Sucessfully")
        res.redirect("/listings");
    })
    };