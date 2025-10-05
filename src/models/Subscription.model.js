import mongoose, { model, Mongoose , Schema }  from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type : Schema.Types.ObjectId,// one who is subscirbing 
        ref : "User"
    },
    channel:{  
          type : Schema.Types.ObjectId,// one who is subscirbing 
        ref : "User"
    }
}, {timestamps:true})


export const Subscriptions = mongoose.model("Subscription" , subscriptionSchema)