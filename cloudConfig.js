import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "LIVIO_DEV",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const cloudinaryV2 = cloudinary.v2;

export { storage, cloudinaryV2 as cloudinary };