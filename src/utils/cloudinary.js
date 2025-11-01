import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // make sure your .env is loaded

// 👇 Reusable function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Cloudinary config
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Upload the file
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
       resource_type: "auto", // automatically detect image/video/pdf etc.
    });

    console.log("✅ File uploaded successfully!");
    console.log("📸 Cloudinary URL:", uploadResult.secure_url);

    // Delete local file after successful upload (optional but recommended)
    fs.unlinkSync(localFilePath);

    return uploadResult;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    fs.unlinkSync(localFilePath); // delete local file even if upload fails
    return null;
  }
};

export  {uploadOnCloudinary}
