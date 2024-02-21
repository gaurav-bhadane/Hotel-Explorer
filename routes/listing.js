const express = require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const listing =require('../models/listing.js')
const {isLoggedIn}=require('../middleware.js')
const {isOwner,isAuthor}=require('../middleware.js')
const {validateListing}=require('../middleware.js')

const listingController = require('../controllers/listing.js')



//INDEX ROUTE
router.get('/',wrapAsync(listingController.index))

//NEW ROUTE

router.get('/new',isLoggedIn,listingController.new)

router.post('/',isLoggedIn,isOwner,validateListing,wrapAsync(listingController.newpost))

//EDIT ROUTE

router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.getedit))

router.put('/:id',validateListing,wrapAsync(listingController.putedit))

//DELETE ROUTE

router.delete('/:id',isLoggedIn,isOwner,wrapAsync(listingController.deleteRoute))

//SHOW ROUTE

router.get('/:id',wrapAsync(listingController.showget))

module.exports=router;