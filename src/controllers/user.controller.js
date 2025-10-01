import { asynchandler } from "../utils/aysnchandler.js";
import { apierror } from "../utils/errohandler.js"
import { User } from "../models/user.model.js";
import { uploadcloudniary } from "../utils/cloudnary.js"
import { apiresponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken"
import { response } from "express";



// gnerateting access and refreshToken 
const generateAccessTokenAndgenrateRefrehToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new apierror(404, "user not found while generating tokens");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        // user.accessToken = accessToken
        return { accessToken, refreshToken }



    } catch (error) {
        throw new apierror(500, "somthing wnet wrong while gnerating refresh and accesstoken");
    }

}

// register user 
const registerUser = asynchandler(async (req, res, next) => {
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
        [fullname, email, username, passward].some((field) => field?.trim() === "")) {
        throw new apierror(400, "All fields are required");
    }

    // Check existing user
    const existeduser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existeduser) {
        throw new apierror(409, "User already exists")
    }

    console.log(req.files);


    const avatarlocalpath = req.files?.avatar[0]?.path;
    // const coverlocalpath = req.files?.coverimage[0]?.path;
    let coverlocalpath;

    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverlocalpath = req.files.coverimage[0].path;

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


// user login function 
const loginuser = asynchandler(async (req, res, next) => {
    //req.body -> data
    // find user 
    // if user not find throw error 
    // passward check 
    // accesstoken and refreshtoken 
    // send cookie

    const { email, username, passward } = req.body;

    if (!username && !email) {
        throw new apierror(400, "email and username are required :  ");
    }

    const finduser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!finduser) {
        throw new apierror(404, " user not find please register")
    }

    const passwardCheck = await finduser.ispasswardCorrect(passward)

    if (!passwardCheck) {
        throw new apierror(401, "passward inccoret ")
    }


    const { refreshToken, accessToken } = await generateAccessTokenAndgenrateRefrehToken(finduser._id)


    const loggeduser = await User.findById(finduser._id).select("-passward -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiresponse(200,
                {
                    user: loggeduser, accessToken, refreshToken,
                },
                "user logged in succesully "
            )
        );


})

const refreshAccessToken = asynchandler(async (req, res, next) => {
    const incomingrefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if (!incomingrefreshToken) {
        throw new apierror(401, "unauthorize request ");
    }


    try {
        const decodedToken = jwt.verify(
            incomingrefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new apierror(401, " User not found in db due to invalid regresh token  ");
        }

        if (incomingrefreshToken !== user.refreshToken) {
            throw new apierror(401, "refresh token is expire  or used ");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newrefreshToken } = await generateAccessTokenAndgenrateRefrehToken(user._id)

        return res
            .status(200)
            .cookie("Access", accessToken, options)
            .cookie("refreshTOken", newrefreshToken, options)
            .json(
                new apiresponse(200, accessToken, newrefreshToken, "acces token refreshed successfully ")
            )
    } catch (error) {
        throw new apierror(401, error?.message || "inavlid refreshtoken ")
    }
})

// logout user function 
const logoutuser = asynchandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            refreshToken: undefined
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiresponse(200, {}, "user logout successfully "))

})

const changeCurrentPassword = asynchandler(async (req, res) => {

    const { oldpassword, newpassward, confpassword } = req.body;

    if (!(newpassward === confpassword)) {
        throw new apierror(400, " passwrod is not matched ")
    }


    const user = await User.findById(req.user?._id)

    const passwardiscorrect = await user.passwardiscorrect(oldpassword);


    if (!passwardiscorrect) {
        throw new apierror(400, " old passward is incorrect ")
    }

    user.passward = newpassward;
    user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new apiresponse(200, {}, "passward is cahnge succesfully "))





})


const getcurrentuser = asynchandler(async (req, res) => {
    return res
        .status(200)
        .json(200, req.user, "cuurretuser fatched succesfully")
})

const updateAccountDetails = asynchandler(async (req, res) => {
    const { fullname, email, mobilenumber } = req.body;

    if (!fullname || !email || !mobilenumber) {
        throw new apierror(400, "all feilds are required : ")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {


        $set: {
            fullname,
            email: email,
            mobilenumber: mobilenumber
        }
    }
        , { new: true }

    ).select("-passward")

    return res
        .status(200)
        .json(new apiresponse(200, user, "Account details updated successfully "))

})


const updateUserAvatar = asynchandler(async (req, res) => {
    const avatarlocalpath = req.file?.path

    if (!avatarlocalpath) {
        throw new apierror(400, "the  avatar file is not found  ")
    }

    const avatar = await uploadcloudniary(avatarlocalpath)

    if (!avatar.url) {
        throw new apierror(400, "error while uplodign on coloudinary ")
    }

     const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-passward")

    return res
        .status(200)
        .json(new apierror(200, user, "the avatr  is updated succesfully "))
})

const updateUserCoverimage = asynchandler(async (req, res) => {
    const coverlocalpath = req.file?.path

    if (!coverlocalpath) {
        throw new apierror(400, "the cover image is not found ")
    }

    const coverimage = await uploadcloudniary(coverlocalpath)


    if (!coverimage.url) {
        throw new apierror(400, "error while uploading cover image on the cloudinary ")
    }

    const user =  await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverimage: coverimage.url
            }
        },
        { new: true }
    ).select("-passward")

    return res
        .status(200)
        .json(new apiresponse(200, user, "the cover image is updated succesfully "))



})


export { registerUser,
     loginuser,
     logoutuser,
     refreshAccessToken,
     changeCurrentPassword, 
     getcurrentuser,
     updateAccountDetails,
     updateUserAvatar, 
     updateUserCoverimage }
// const registerUser = (req, res) => {
//     res.json({
//         headers: req.headers,
//         body: req.body,
//         files: req.files
//     });
// };

// export { registerUser }
