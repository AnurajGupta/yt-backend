import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    if (fs.existsSync(localFilePath)) {
      // File exists, proceed with unlinking
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      // File exists, proceed with unlinking
      fs.unlinkSync(localFilePath);
    }
    // it removes the locally saved file as the upload operation got failed.
    return null;
  }
};

const deleteOnCloudinary = async(public_id , resource_type="image") =>{ // default resource type is image
  try{
    if(!public_id)return null;
    const response = await cloudinary.uploader.destroy(public_id , {
      resource_type:`${resource_type}`
    })
  }catch(error){
    console.log("Delete on cloudinary failed" , error);
    return null;
  }
}

export { uploadOnCloudinary , deleteOnCloudinary};
