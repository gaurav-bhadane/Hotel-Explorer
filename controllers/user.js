const User= require("../models/user.js");

module.exports.getsignup=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.postsignup=async(req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        const newUser = new User ({
            username:username,
            email:email
        });
        let registeredUser=await User.register(newUser,password)
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
}

module.exports.getlogin=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.postlogin=async(req,res)=>{
    // const {username,password}=req.body;
    req.flash("success","You are logged in")
    // res.send("Welcome to Wanderlust!! You're logged in.")
    let redirectUrl=res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl)
}

module.exports.getlogout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You've been logged out!")
        res.redirect('/listings')
    })
}