import {v2 as cloudinary} from "cloudinary";

import {config} from "dotenv";

config()

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_PROFILE_NAME,
    api_key : process.env.PROFILE_API_KEY,
    api_secret: process.env.PROFILE_API_SECRET,
});

export default cloudinary;