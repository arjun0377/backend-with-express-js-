import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const userrouter = Router()

userrouter.route("/register").post(registerUser)

export default userrouter