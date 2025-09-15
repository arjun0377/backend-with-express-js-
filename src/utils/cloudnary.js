import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET  // Click 'View API Keys' above to copy your API secret
    });

    
   const uploadcloudniary = async function (localfilepath){
      try {
        if(!localfilepath)
            return null
      //upload file on the cloudinary 
        const result =  await cloudinary.uploader.upload(localfilepath , {
            resource_type: 'auto'
        })

        //file has been uploadded succesfully 
        console.log("the file has been uploded succeesfullly " , result.url)
        return result;
      } catch (error) {
        fs.unlinkSync(localfilepath); // it removes the link between saved temperory file on the server 
        return null
        
      }
   }



   export {uploadcloudniary}





    //   const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);