const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require("./review.js")

 const listingSchema = new Schema ({
    title : {
        type:String,
        required:true
    },
    description : {
        type:String
    },
    image : {
        type:String,
        default:"https://www.vedantu.com/seo/content-images/995fca49-5864-481e-b1f1-7043d27f7058.jpg",
        set: (v)=> v===""?"https://www.vedantu.com/seo/content-images/995fca49-5864-481e-b1f1-7043d27f7058.jpg"
            :v
    },
    price : {
        type:Number
    },
    location :  {
        type:String
    },
    country :  {
        type:String
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
 })

 listingSchema.post("findOneAndDelete",async(data)=>{
    if (data){
        await Review.deleteMany({_id : {$in: data.reviews}}).then(res=>console.log(res))
    }
})

 const listing = mongoose.model("listing",listingSchema)

 module.exports=listing