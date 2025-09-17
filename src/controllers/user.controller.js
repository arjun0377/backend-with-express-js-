// import { json } from "express";
import {asynchandler} from "../utils/aysnchandler.js";
import {apierror} from "../utils/errohandler.js"
import { User } from "../models/user.model.js";
import {uploadcloudniary} from "../utils/cloudnary.js"
import { apiresponse } from "../utils/apiresponse.js";

const registerUser = asynchandler(async  (res , req) =>{
      //get the user details from the frontedn 
    // validate the user detail 
    // check if the user si already exxits 
    // check for images and avatar 
     // upload them on the clouydinary 
     // create a user object - creater a entry in db
     //remove  password and refresh token from the fields
     // check for user creation 
     // req response 

     const {fullname , email , username ,  passward } =  req.body
     console.log("email" , email);


    if(
       [fullname , email , username , passward].some((field) =>
        field?.trim() === "") 
    ){
        throw new apierror(400 , "all fields are required ") 
    }


    const existeduser = User.findOne({
        $or:[{ email } , { username }]
    })

    if(existeduser){
        throw new apierror(409 , "user already exist ")
    }

       const avatarlocalpath =  req.files?.avatar[0]?.path;
       const  coverlocalpath =  req.files?.avatar[0]?.path;


       if(!avatarlocalpath){
        throw new apierror(400 , "Avatar is required");
       }

     const avatar  =  await uploadcloudniary(avatarlocalpath)
     const coverimage  =  await uploadcloudniary(coverlocalpath)

   if(!avatar){
    throw new apierror(400 , "Avatar is required");
   }

    await  User.create({
        fullname,
        avatar:avatar.url,
        coverimage:coverimage?.url || "",
        email,
        passward,
       username: username.toLowerCase(),

    })

    const createduser = await User.findById(User._id).select(
        "-passward -refreshtoiken"
    )

    if(!createduser){
        throw new apierror(500 , "something went wrong  while user register ")
    }
    
    return res.status(201).json(
        new apiresponse(200 , createduser ,"user registered  suucessefully ")
    )
})

export {registerUser}