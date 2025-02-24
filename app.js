
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app  = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js")

app.engine("ejs" , ejsMate);
app.set("view engine" , "ejs");
app.set("views" ,path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl)
}

main().then(() =>{
    console.log("connected sucessfully");
}) .catch((err) => {
    console.log(err);
})

const store = MongoStore.create ({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
    
    });
store.on("error", () =>{
console.log("Error in mongo session store", err);
})
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    }
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.sucess= req.flash("sucess");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
})

// app.get("/demouser", async (req,res) => {
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username: "sigma-stu"
//     })

//    let registereduser =  await User.register(fakeuser,"helloWorld");
//    res.send(registereduser);
// })


app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter);

app.all("*", (req, res, next ) => {
    next(new ExpressError(404,"Page Not Found!"))
})


app.use((err, req, res, next) => {
let{ status= 500 , message = "Something Went Wrong"} = err;
res.status(status).render("listings/error.ejs" , {message})
console.log(err);
})

app.listen(port, () => {
    console.log(`app listening on port: ${port}`);
})