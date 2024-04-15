if(process.env.NODE_ENV != "production") {
    require('dotenv').config() ;
}


const express = require("express") ;
const app = express() ;
const mongoose = require ("mongoose") ;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const path = require("path") ;
const ExpressError = require("./utils/ExpressError.js")
const port = 8080 ;
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js") ;
const usersRouter = require("./routes/user.js") ;

let dbUrl = process.env.ATLASDB_URL ;

const session = require("express-session") ;
const MongoStore = require('connect-mongo');
const flash = require("connect-flash") ;
const passport = require("passport") ;
const LocalStrategy = require("passport-local") ;
const User = require("./models/user.js") ;

app.set("view engine" , "ejs") ;
app.set("views" , path.join(__dirname , "views")) ;
app.use(express.urlencoded({extended : true})) ;
app.use(express.json()) ;
app.use(methodOverride ("_method"))
app.use(express.static(path.join(__dirname , "/public")))
app.engine('ejs', ejsMate);

async function main() {
    await mongoose.connect(dbUrl);
}

main()
.then(res => {
    console.log("connection Succesful")
})
.catch(err => {
    console.log(err) ;
})

const store = MongoStore.create({
    mongoUrl : dbUrl , 
    crypto : {
        secret : process.env.SECRET  ,
    } ,
    touchAfter : 24*3600 //after how much time our session will be updated if nothing is changed in it.
}) ;

store.on("error" , () => {
    console.log("ERROR in Mongo session store" , err) ;
})

const sessionOptions = {
    store ,
    secret : process.env.SECRET ,
    resave : false ,
    saveUninitialized : true ,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge :  7 * 24 * 60 * 60 * 1000 ,
        httpOnly : true 
    }
}

app.use(session(sessionOptions)) ;
app.use(flash()) ;

app.use(passport.initialize()) ;
app.use(passport.session()) ;
passport.use(new LocalStrategy (User.authenticate())) ;

//serializing means storing the data of user inside a session .
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
    res.locals.success = req.flash("success") ;
    res.locals.error = req.flash("error") ;
    res.locals.currUser = req.user ;
    next() ;
})


app.use("/listings" , listingsRouter) ;
app.use("/listings/:id/reviews" , reviewsRouter) ;
app.use("/" , usersRouter) ;

app.all("*" , (req , res , next) => {
    next(new ExpressError (404 , "Page not Found")) ;
})

app.use ((err , req , res , next) => {
    let {status=500 , message="Something went wrong"} = err ;
    res.status(status).render("error.ejs" , {err}) ;
    // res.status(status).send(message);
})

app.listen(port , () => {
    console.log("Listening to the server") ;
})