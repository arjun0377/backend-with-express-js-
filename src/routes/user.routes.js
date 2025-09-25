import { Router } from "express";
import {  loginuser, logoutuser, registerUser } from "../controllers/user.controller.js";
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

export default router