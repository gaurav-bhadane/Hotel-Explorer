const express = require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require('../utils/ExpressError')
const User= require("../models/user.js");
const passport = require('passport');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async(req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        const newUser = new User ({
            username:username,
            email:email
        });
        let registeredUser=await User.register(newUser,password)
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if (err){
                return next(err)
            }
            req.flash("success","Welcome to Wanderlust")
            res.redirect("/listings")
        })
        
    }catch(e){
        req.flash("error",e.message)
        res.redirect('/signup')
    }
}))

router.get('/login',(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",passport.authenticate("local",{
    failureRedirect: '/login',
    failureFlash:true
}),wrapAsync(async(req,res)=>{
    // const {username,password}=req.body;
    req.flash("success","You are logged in")
    // res.send("Welcome to Wanderlust!! You're logged in.")
    res.redirect("/listings")
}))

router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You've been logged out!")
        res.redirect('/listings')
    })
})

module.exports=router