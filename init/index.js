import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listing from "../models/listing.js";

const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main(params) {
  mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listings = sampleListings.map((ob) => ({
    ...ob,
    image: {
      url: typeof ob.image === "string" ? ob.image : ob.image.url,
      filename: "listingImage",
    },
    owner: "6a2b11adafdd4c16241c5bb5",
  }));

  await Listing.insertMany(listings);
  console.log("Data was initialized");
};

initDB();
