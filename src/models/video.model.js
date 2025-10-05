import mongoose, { Schema, Types } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoschema = new Schema({
    videofile: {
        Type: String,
        required: true,

    },
    thumbnail: {
        Type: String, //cloudnary url 
        required: true,

    },
    owner: {
        Type: Schema.Types.ObjectId,
        ref:"User",
        // unique : true
    },
    title: {
        Type: String,
        required: true,
    },
    description: {
        Type: String,
        required: true,
    },
    duration: {
        Type: Number,
        required: true,
    },
    views: {
        Type: Number,
        default: 0,
        required: true,
    },
    ispublised: {
        Type: Boolean,
        required: true,
        default:true
    },
    sd: {
        Type: String,
        required: true,
    },
}, { timestamps: true })

videoschema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoschema)