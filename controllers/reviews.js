import Review from "../models/review.js";
import Listing from "../models/listing.js";
const createReviews = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review Saved");
    req.flash("success","New review created");
    req.flash("error", "Failed to create review")
    res.redirect(`/listings/${id}`);
  };


  const deleteReviews = async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
  }

  export default {createReviews, deleteReviews};