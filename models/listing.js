const mongoose = require("mongoose");
const Review = require("./reviews.js") ;
const User = require("./user.js") ;

let listingSchema = new mongoose.Schema({
    title : {
        type : String ,
        required : true ,
    } , 
    description : {
        type : String , 
    },
    image : {
        url : String ,
        filename : String ,
    } ,
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Review"
        }
    ] , 
    owner : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
    } , 
    geometry :  {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
})

listingSchema.post("findOneAndDelete" , async (data) => {
    if(data) {
        await Review.deleteMany({_id : {$in : data.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;