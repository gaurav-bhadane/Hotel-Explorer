const express = require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const {reviewSchema}=require("../schema.js")
const Review=require("../models/review.js")
const ExpressError=require('../utils/ExpressError')
const listing =require('../models/listing.js')

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

//REVIEW ROUTE

router.post('/',validateReview,wrapAsync(async (req,res)=>{
    let listings=await listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    listings.reviews.push(newReview)
    await newReview.save().then(res=>console.log(res))
    await listings.save()
    res.redirect(`/listings/${listings._id}`)
}))

router.delete('/:reviewId',wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))


module.exports=router;