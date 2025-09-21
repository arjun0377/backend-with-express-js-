// import { json } from "express";
import { asynchandler } from "../utils/aysnchandler.js";
import { apierror } from "../utils/errohandler.js"
import { User } from "../models/user.model.js";
import { uploadcloudniary } from "../utils/cloudnary.js"
import { apiresponse } from "../utils/apiresponse.js";

const registerUser = asynchandler(async (req, res , next) => {
        //    Promise.resolve(fn(req, res, next)).catch(next)
    //get the user details from the frontedn 
    // validate the user detail 
    // check if the user si already exxits 
    // check for images and avatar 
    // upload them on the clouydinary 
    // create a user object - creater a entry in db
    //remove  password and refresh token from the fields
    // check for user creation 
    // req response 


    // console.log("HEADERS:", JSON.stringify(req.headers, null, 2));
    // console.log("FILES:", req.files);
    
    const { fullname, email, username, passward } = req.body;
    // console.log("BODY:", req.body);

    if (
        [fullname, email, username, passward].some((field) => field?.trim() === ""))
         {
        throw new apierror(400, "All fields are required");
    }

    // Check existing user
    const existeduser = await User.findOne({
        $or : [{ email }, { username }]
    });

    if (existeduser) {
        throw new apierror(409, "User already exists")
    }

    console.log(req.files);
    

    const avatarlocalpath = req.files?.avatar[0]?.path;
    // const coverlocalpath = req.files?.coverimage[0]?.path;
    let coverlocalpath;

    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0 ){
        coverlocalpath  = req.files.coverimage[0].path;

    }

    if (!avatarlocalpath) {
        throw new apierror(400, "Avatar file is required");
    }

    const avatar = await uploadcloudniary(avatarlocalpath);
    const coverimage = await uploadcloudniary(coverlocalpath);

    if (!avatar) {
        throw new apierror(400, "Avatar upload failed");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.secure_url,
        coverimage: coverimage?.secure_url || "",
        email,
        passward,
        username: username.toLowerCase(),
    });

    const createduser = await User.findById(user._id).select(
        "-passward -refreshToken"
    );

    if (!createduser) {
        throw new apierror(500, "something went wrong while user register");
    }

    return res.status(201).json(
        new apiresponse(200, createduser, "user registered successfully")
    );
});



 const login = asynchandler(async(req , res , next) =>{
    //email verification from mongodb
    //pasward verfication  from mongodb
    // if both are correct continiue 
    // if not then shwo error from email error or passward error 
    
 })

export { registerUser }
// const registerUser = (req, res) => {
//     res.json({
//         headers: req.headers,
//         body: req.body,
//         files: req.files
//     });
// };

// export { registerUser }
