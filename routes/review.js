const express = require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const Review=require("../models/review.js")
const listing =require('../models/listing.js')
const {validateReview}=require('../middleware.js')



//REVIEW ROUTE

router.post('/',validateReview,wrapAsync(async (req,res)=>{
    let listings=await listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    listings.reviews.push(newReview)
    await newReview.save().then(res=>console.log(res))
    await listings.save()
    req.flash("success","New Review Created")
    res.redirect(`/listings/${listings._id}`)
}))

router.delete('/:reviewId',wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`)
}))


module.exports=router;