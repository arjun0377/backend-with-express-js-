// import { configDotenv } from "dotenv";
// require('dotenv').config()
import dotenv from "dotenv";
import connectDB from "./db/database.js";
import express from "express"
import { DB_NAME } from "./constants.js";

dotenv.config({
    path:'./.env'
})

connectDB();













/*

import mongoose  from "mongoose";
import { DB_NAME } from "./constants";
import express from "express"

const app = express();


( async ()=>{
    try {
        await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("ERROR", (error)=>{
            console.log("ERROR" , error)
            throw error
        })
        app.listen(process.env.PORT , ()=>{
            console.log(`the app is listnig ont eh ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR" , error);
        throw err;
    }
})()
*/