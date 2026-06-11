import Listing from "./models/listing.js";
import Review from "./models/review.js";
import { listingSchema, reviewSchema } from "./schema.js";
import ExpressError from "./utils/expressError.js";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.session.formData = req.body;
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have the permission");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You have not created this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error, value } = reviewSchema.validate(req.body.review);
  if (error) {
    throw new ExpressError(404, error.details[0].message);
  } else {
    next();
  }
};

export default {
  saveRedirectUrl,
  isLoggedIn,
  isOwner,
  validateListing,
  validateReview,
  isReviewAuthor,
};
