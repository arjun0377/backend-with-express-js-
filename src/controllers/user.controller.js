// import { json } from "express";
import {asynchandler} from "../utils/aysnchandler.js";


const registerUser = asynchandler(async  (res , req) =>{
    return res.status(200).json({
        message : " te mesege is recieved"
})
})

export {registerUser}