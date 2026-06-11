import express, { response } from "express";
const listings = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema, reviewSchema } from "../schema.js";
import Listing from "../models/listing.js";
import middleware from "../middleware.js";
import listingController from "../controllers/listings.js";
import multer from "multer";
import { cloudinary, storage } from "../cloudConfig.js";

const upload = multer({ storage });

//index route
listings.get("/", wrapAsync(listingController.index));

//router.route for new listings
listings
  .route("/new")
  .get(middleware.isLoggedIn, listingController.renderNewForm)
  .post(
    middleware.isLoggedIn,
    upload.single("listing[image]"),
    middleware.validateListing,
    wrapAsync(listingController.createListing),
  );

//router.route for show, update and delete
listings
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    middleware.isLoggedIn,
    middleware.isOwner,
    upload.single("listing[image]"),
    middleware.validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(
    middleware.isLoggedIn,
    middleware.isOwner,
    wrapAsync(listingController.destroyListing),
  );

//edit route
listings.get(
  "/:id/edit",
  middleware.isLoggedIn,
  middleware.isOwner,
  wrapAsync(listingController.editListing),
);

export default listings;
