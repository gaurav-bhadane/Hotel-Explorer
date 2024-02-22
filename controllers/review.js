const listing =require('../models/listing.js')
const Review=require("../models/review.js")

module.exports.reviewPost=async (req,res)=>{
    let listings=await listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author  = req.user._id;
    listings.reviews.push(newReview)
    await newReview.save()
    await listings.save()
    req.flash("success","New Review Created")
    res.redirect(`/listings/${listings._id}`)
}

module.exports.reviewDelete=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`)
}