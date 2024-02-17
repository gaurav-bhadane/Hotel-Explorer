const express = require('express')
const app = express();
const mongoose =require('mongoose')
const path = require('path')
const methodOverride=require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require('./utils/ExpressError')
const {listingSchema}=require("./schema.js")
const {reviewSchema}=require("./schema.js")
const Review=require("./models/review.js")

app.use(methodOverride('_method'))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views/listing"))
app.use(express.static(path.join(__dirname,"public/css")))
app.use(express.static(path.join(__dirname,"public/js")))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate);

const listings=require('./routes/listing.js')


app.use('/listings',listings)

//requiring listing model
const listing =require('./models/listing.js')

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then(()=>console.log("Connected to Database"))
    .catch(err=>console.log(err))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"public")))


const port = 8080;


const validateReview = async (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if (error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        console.log(errMsg)
        next( new ExpressError(400,errMsg))
    }
    else{
        next()
    }
}




// app.get('/testlistings',async (req,res)=>{
//     let listing1= new listing ({
//         title: "Gaurav Bhadane",
//         description:"Autobiography",
//         price:499,
//         location:"Nandurbar",
//         country:"India"
//     })
//     await listing1.save()
//         .then(res=>console.log(res))
// })




//REVIEW ROUTE

app.post('/listings/:id/reviews',validateReview,wrapAsync(async (req,res)=>{
    let listings=await listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    listings.reviews.push(newReview)
    await newReview.save().then(res=>console.log(res))
    await listings.save()
    res.redirect(`/listings/${listings._id}`)
}))

app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))

app.get('/',(req,res)=>{
    res.send("Server Working")
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"))
})

app.use((err,req,res,next)=>{
    let {status=500,message="Internal Server Error!!"}=err;
    res.render("error.ejs",{err})
})

app.listen(port,(req,res)=>{
    console.log(`App Listening on Port ${port}`)
})