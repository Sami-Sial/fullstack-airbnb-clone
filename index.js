if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverrride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.model.js");

const listingRoutes = require("./routes/listing.routes.js");
const reviewRoutes = require("./routes/review.routes.js");
const userRoutes = require("./routes/user.routes.js");


const app = express();

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL);
}
connectDB()
.then(() => {console.log("Successfully connected to Mongo DB")})
.catch((err) => { console.log("Mongo DB Atlas connection Failed => ", err.message) });


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));        
app.use(methodOverrride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: process.env.DB_URL,
    crypto: {
        secret: process.env.MONGO_STORE_SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error", () => {
    console.log("Error in Mogo Session Store", error);
})

const sessionOptions = {
    store,
    secret: process.env.SESSION_SERCRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings", listingRoutes); 
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


app.get("*", (req,res,next) => {
   next(new ExpressError(404, "Page Not Found"));
})


// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrond" } = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", { message })
})


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
})