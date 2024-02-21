const express = require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const Review=require("../models/review.js")
const listing =require('../models/listing.js')
const {validateReview, isAuthor}=require('../middleware.js')
const {isLoggedIn}=require('../middleware.js')
const reviewController = require('../controllers/review.js')


//REVIEW ROUTE

router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.reviewPost))

router.delete('/:reviewId',isLoggedIn,isAuthor,wrapAsync(reviewController.reviewDelete))


module.exports=router;