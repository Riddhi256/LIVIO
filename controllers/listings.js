import Listing from "../models/listing.js";
import { cloudinary } from "../cloudConfig.js";

const index = async (req, res) => {
  let search = req.query.search;
  let allListings;
  if (search) {
    allListings = await Listing.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ],
    });

    if (allListings.length === 0) {
      req.flash("error", `No listings found matching "${search}"`);
      return res.redirect("/listings");
    }
  } else {
    allListings = await Listing.find();
  }

  res.render("listings/index", { allListings });
};

const renderNewForm = (req, res) => {
  res.render("listings/new");
};

const createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing created successfully!!!");
  req.flash("error", "Error: Cannot add a new listing please retry");
  res.redirect("/listings");
};

const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
    return;
  }
  res.render("listings/show", { listing });
};

const editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
    return;
  }
  let OriginalUrl = listing.image.url;
  OriginalUrl = OriginalUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit", { listing, OriginalUrl });
};

const updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  Object.assign(listing, req.body.listing);
  if (req.file) {
    // Delete old image from Cloudinary
    await cloudinary.uploader.destroy(listing.image.filename);
    // Save new image info
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

const destroyListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (listing?.image?.filename) {
    await cloudinary.uploader.destroy(
      listing.image.filename
    );
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

export default {
  renderNewForm,
  index,
  createListing,
  showListing,
  editListing,
  updateListing,
  destroyListing,
};
