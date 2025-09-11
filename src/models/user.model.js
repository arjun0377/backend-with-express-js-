import mongoose, { Schema, Types } from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt "
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
        index: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
        index: true

    },
    passward: {
        type: String,
        required: [true, 'passward is required'],
        unique: true,
        lowerCase: true,
        trim: true,
    },
    mobilenumber: {
        type: Number,
        required: true,
        trim: true,

    },
    coverimage: {
        type: String,
        // required: true,
    },
    avatar: {
        type: String,//cloudanry url
        required: true,
    },
    watchhistory: [
        {
        type: Schema.Types.ObjectId,
        ref: "video"
        }
    ],
    refreshtoikenL: {
        Type: String,

    }

}, { timestamps: true })

userSchema.pre("save" , async function(next){
    if(!this.isModified("passward")) return next()
    this.passward= bcrypt.hash(this.passward , 10)
    next()
})

userSchema.methods.ispasswardCorrect = async function (passward) {
     return await bcrypt.compare(passward , this.passward )
    
}
export const User = mongoose.model("User", userSchema)