const express = require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require('../utils/ExpressError')
const User= require("../models/user.js");
const passport = require('passport');
const {saveRedirectUrl}=require('../middleware.js')
const userController = require('../controllers/user.js')


router.get("/signup",userController.getsignup)

router.post("/signup",wrapAsync(userController.postsignup))

router.get('/login',userController.getlogin)

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect: '/login',
    failureFlash:true
}),wrapAsync(userController.postlogin))

router.get('/logout',userController.getlogout)

module.exports=router