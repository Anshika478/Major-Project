const User = require("../models/user.js") ;

module.exports.renderSignupForm = (req , res) => {
    res.render("users/signup.ejs") ;
} ;

module.exports.postSignup = async(req , res , next) => {
    try {
        let {username , email , password} = req.body ;
        let newUser = new User ({
            email , username 
        })
        const registeredUser = await User.register(newUser , password) ;
        req.login(registeredUser , (err) => {
            if(err) {
                return next(err) ;
            } else {
                req.flash("success" , "Welcome to Wanderlust") ;
                res.redirect("/listings") ;
            }
        })
    } catch (err) {
        req.flash("error" ,  err.message)
        res.redirect("/signup") ;
    }
} ;

module.exports.renderLoginForm = (req , res) => {
    res.render("users/login.ejs") ;
} ;

module.exports.postlogin = async(req , res) => {
    // let redirectUrl = res.locals.redirectUrl || "/listings" ;
    
    let redirectUrl ;

    if(res.locals.redirectUrl) {
         redirectUrl = res.locals.redirectUrl ;
    } else {
         redirectUrl = "/listings" ;
    }
    req.flash("success" , "Welcome back to wanderlust !") ;
    res.redirect(redirectUrl)
} ;


module.exports.logout = (req , res , next) => {
    req.logout((err) => {
        if(err) {
            return next(err) ;
        } else {
            req.flash("success" , "You logged out successfully !") ;
            res.redirect("/listings") ;
        }
    })
}


