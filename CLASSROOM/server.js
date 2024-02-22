const express = require('express')
const app = express();
const session =require('express-session')
const flash = require("connect-flash")
const path = require('path')

app.use(flash());
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))

// const cookieParser= require("cookie-parser")
const users = require('./routes/user.js')
const posts = require('./routes/post.js')

const sessionOptions={
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true
};

app.use(session(sessionOptions));

app.use((req,res,next)=>{
    res.locals.Success=req.flash("Success");
    res.locals.Error=req.flash("Error");
    next()
})


app.get('/register',(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    console.log(req.session.name)
    if (name==="anonymous"){
        req.flash("Error","User not Registered")
    }else{
        req.flash("Success","User Registered Successfully")
    }
    res.redirect('/hello')
    
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name})
    // res.send(`hello ${req.session.name}`)
})


// app.use(session({
//     secret: "mysupersecretstring",
//     resave:false,
//     saveUninitialized:true
// }))

// app.get('/reqcount',(req,res)=>{
//     if (req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
    
//     res.send(`You sent a request ${req.session.count}`)
// })

// app.get('/test',(req,res)=>{
//     res.send("Test Successfull")
// })

// app.use("/posts",posts)
// app.use("/users",users)

// app.use(cookieParser("secretcode"))

// //COOKIES

// app.get('/getsignedcookie',(req,res)=>{
//     res.cookie("Name","Gaurav",{signed:true})
//     res.send("signed Cookie Send")
// })

// app.get('/verify',(req,res)=>{
//     console.log(req.signedCookies)
//     res.send("Verified")
// })

// app.get('/getcookies',(req,res)=>{
//     res.cookie("name","Gaurav");
//     res.cookie("location","India");
//     res.send("Sent you some cookies!")
//     console.log(req.cookies)
// })

// app.get('/name',(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hello ${name}, How are you?`)
// })


// //ROOT
// app.get('/',(req,res)=>{
//     res.send("Hello I'm root")
// })





app.listen(3000,()=>{
    console.log("App listening on Port 3000")
})