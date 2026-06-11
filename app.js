import dotenv from "dotenv";

import express from "express";
const app = express();
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/expressError.js";
import listings from "./routes/listing.js";
import reviews from "./routes/reviews.js";
import user from "./routes/user.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import flash from "connect-flash";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import multer from "multer";
import User from "./models/user.js";

const port = 8080;
const db_Url = process.env.ATLASDB_URL;
const store = MongoStore.create({
  mongoUrl: db_Url,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 60 * 60 * 24 
});

store.on("error",()=>{
  console.log("Error in MONGO SESSION STORE");
  });

const sessionOptions = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
// const upload = multer({ dest: 'uploads/' })



main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main(params) {
  mongoose.connect(db_Url);
}


// app.get("/", (req, res) => {
//   res.send("This is root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


// app.get("/demoUser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username: "student"
//   });
//   let registerUser = await User.register(fakeUser,"helloworld");
//   res.send("User registered");
// });

//listing routes
app.use("/listings", listings);

//review routes
app.use("/listings/:id/reviews", reviews);

//user routes
app.use("/",user);

app.get("/privacy", (req, res) => {
    res.render("legal/privacy");
});

app.get("/terms", (req, res) => {
    res.render("legal/terms");
});

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error", { message });
  //res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log("Server started");
});
