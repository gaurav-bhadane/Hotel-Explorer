if (process.env.NODE_ENV !="production"){
    require('dotenv').config()
}




const express = require('express')
const app = express();
const mongoose =require('mongoose')
const path = require('path')
const methodOverride=require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError=require('./utils/ExpressError')
const session =require('express-session')
const mongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User= require("./models/user.js")
app.use(methodOverride('_method'))

// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'

const dbUrl = process.env.ATLAS_DB_URL;

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views/listing"))
app.use(express.static(path.join(__dirname,"public/css")))
app.use(express.static(path.join(__dirname,"public/js")))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate);

const store = mongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24*60*60
})

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err)
})


const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
}


app.use(session(sessionOptions)) 
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next()
})

const listingsRouter=require('./routes/listing.js')
const reviewsRouter=require('./routes/review.js')
const userRouter=require('./routes/user.js')



app.use('/listings',listingsRouter)
app.use('/listings/:id/reviews',reviewsRouter)
app.use('/',userRouter);

//requiring listing model
const listing =require('./models/listing.js')



async function main(){
    await mongoose.connect(dbUrl);
}



main()
    .then(()=>console.log("Connected to Database"))
    .catch(err=>console.log(err))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"public")))

const port = 8080;

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"))
})

app.use((err,req,res,next)=>{
    let {status=500,message="Internal Server Error!!"}=err;
    res.render("error.ejs",{err})
})

app.listen(port,(req,res)=>{
    console.log(`App Listening on Port ${port}`)
})