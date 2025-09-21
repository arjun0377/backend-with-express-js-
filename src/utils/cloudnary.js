import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadcloudniary = async (localFilePath) => {
    try {
        // console.log("Uploading file : " , localFilePath)
        if (!localFilePath){
          console.log("No file path is provide"); return null;
          
        }
    
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        //  console.log("Cloudinary response:", response);
        fs.existsSync(localFilePath)
        
         // file has been uploaded successfully
         // console.log("file is uploaded on cloudinary", response.url);
         
         
         // Remove file from local storage only if it exists
         // if (fs.existsSync(localFilePath)) {
            // }
            fs.unlinkSync(localFilePath)
        
        return response;

    } catch (error) {
         console.error("Cloudinary upload error:", error);
        // Remove the locally saved temporary file as the upload operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return null;
    }
}

export {uploadcloudniary}