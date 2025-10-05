import { Router } from "express";
import {  changeCurrentPassword, getcurrentuser, getUserChannelProfile, loginuser, logoutuser, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverimage, userWatchHistroy } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verfyJWT } from "../middleware/auth.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";


const router = Router();

router.route("/register").post(
  upload.fields([
    { name : "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 }
  ]),
  registerUser
)

router.route("/login").post(loginuser)


//secured routes
router.route("/logout").post(verfyJWT , logoutuser)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/Change-password").post(verfyJWT  , changeCurrentPassword)
router.route("/get-Currentuser").get(getcurrentuser)
router.route("/Update-details").patch(verfyJWT  , updateAccountDetails)
router.route("/Update-avatar").patch(verfyJWT ,upload.single("avatar")  , updateUserAvatar)
router.route("/Update-coverimage").patch(verfyJWT  , upload.single("coverimage"),  updateUserCoverimage)
router.route("/c/:username").get(verfyJWT  , getUserChannelProfile)
router.route("/get-user-watchhistory").get(verfyJWT  , userWatchHistroy)


export default router