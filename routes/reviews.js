import express, { response } from "express";
const reviews = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema, reviewSchema } from "../schema.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import reviewController from "../controllers/reviews.js"
import middleware from "../middleware.js";


//creating reviews
reviews.post(
  "/",
  middleware.validateReview,middleware.isLoggedIn,
  wrapAsync(reviewController.createReviews),
);

//delete review
reviews.delete(
  "/:reviewId",middleware.isLoggedIn,middleware.isReviewAuthor,
  wrapAsync(reviewController.deleteReviews),
);

export default reviews;