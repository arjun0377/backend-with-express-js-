import { User } from "../models/user.model.js";
import { asynchandler } from "../utils/aysnchandler.js";
import { apierror } from "../utils/errohandler.js";
import  jwt  from "jsonwebtoken"


export const verfyJWT = asynchandler(async (req, res, next) => {
try {
    
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new apierror(401, "unatuhorizes access")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
     const user =   await User.findById(decodedToken?._id).select("-passward -refreshToken")
    
        if(!user){
            throw new apierror(401 , "Invalid access Token ")
        }

        req.user = user;
        next()
} catch (error) {
    throw new apierror(401 , error?.message || "Invalid access  Token")
}

}) 