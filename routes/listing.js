const express = require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const listing =require('../models/listing.js')
const {isLoggedIn}=require('../middleware.js')
const {isOwner,isAuthor}=require('../middleware.js')
const {validateListing}=require('../middleware.js')

const listingController = require('../controllers/listing.js')

router
    .route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,wrapAsync(listingController.newpost))

//NEW ROUTE

router.get('/new',isLoggedIn,listingController.new)


router
    .route('/:id')
    .put(validateListing,wrapAsync(listingController.putedit))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteRoute))
    .get(wrapAsync(listingController.showget))


//EDIT ROUTE

router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.getedit))

module.exports=router;