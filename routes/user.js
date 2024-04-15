const express = require("express") ;
const router = express.Router() ;
const wrapAsync = require("../utils/wrapAsync.js") ;
const passport = require("passport") ;
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm) 
.post(wrapAsync(userController.postSignup)) ;

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl , passport.authenticate("local" ,  { failureRedirect: '/login' , failureFlash : true }) ,wrapAsync(userController.postlogin));

router.get("/logout" , userController.logout) ;

module.exports = router ;

// router.get("/signup" , userController.renderSignupForm) ;

// router.post("/signup" , wrapAsync(userController.postSignup)) ;

// router.get("/login" , userController.renderLoginForm) ;

// router.post("/login" , saveRedirectUrl , passport.authenticate("local" ,  { failureRedirect: '/login' , failureFlash : true }) ,wrapAsync(userController.postlogin))


