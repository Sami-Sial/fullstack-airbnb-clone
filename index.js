if (process.env.NODE_ENV != "production") {
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
const User = require("./models/user.model.js");
// const LocalStrategy = require("passport-local");

const listingRoutes = require("./routes/listing.routes.js");
const reviewRoutes = require("./routes/review.routes.js");
const userRoutes = require("./routes/user.routes.js");
const { log } = require("console");
const Listing = require("./models/listing.model.js");

const app = express();

const connectDB = async () => {
  await mongoose.connect(process.env.DB_URL);
};
connectDB()
  .then(() => {
    console.log("Successfully connected to Mongo DB");
  })
  .catch((err) => {
    console.log("Mongo DB Atlas connection Failed => ", err.message);
    process.exit(1);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverrride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret: process.env.MONGO_STORE_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in Mogo Session Store", error);
});

const sessionOptions = {
  store,
  secret: process.env.SESSION_SERCRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.js");

app.use((req, res, next) => {
  console.log(req.session);

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  console.log(req.user?._id);

  res.locals.currUser = req.user;

  next();
});

app.use("/", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrond" } = err;
  // res.status(statusCode).send(message);
  console.log("error message", message);

  res.render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

// const insertUser = async () => {
//   const newListing = new Listing({
//     title: " EcoHorizon Villa: A Sustainable Masterpiece in the Desert",
//     description:
//       "Blending sustainability with cutting-edge design, EcoHorizon Villa is a one-of-a-kind property located in the serene Arizona desert. This energy-efficient home features solar panels, a living green roof, and an open-concept layout that maximizes natural light. With a stunning infinity pool, outdoor fire pit, and panoramic mountain views, this trending property is perfect for those seeking modern luxury with an eco-conscious twist.",
//     price: 350,
//     address: "4567 Solstice Canyon Road, Scottsdale, AZ 85262",
//     geometry: {
//       type: "Point",
//       coordinates: [111.6687, 33.7455],
//     },
//     propertyInfo: {
//       type: "Trending",
//       guests: 3,
//       rooms: 3,
//       beds: 3,
//       bathrooms: 2,
//     },
//     images: [
//       {
//         url: "https://i.im.ge/2025/03/14/psfh71.4.png",
//         filename: "wanderlust_DEV/klanmlxhm7mkjs0bnlew",
//       },
//       {
//         url: "https://i.im.ge/2025/03/14/psfIbp.5.png",
//         filename: "wanderlust_DEV/csgv6vrlgkvz3dzzgzf9",
//       },
//       {
//         url: "https://i.im.ge/2025/03/14/psfDiq.6.png",
//         filename: "wanderlust_DEV/bmggxbktxdn47elq3xz1",
//       },
//     ],
//     owner: "",
//   });

//   const listing = await newListing.save();

//   console.log(listing);
// };

// insertUser();
