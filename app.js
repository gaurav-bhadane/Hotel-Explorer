const express = require('express')
const app = express();
const mongoose =require('mongoose')
const path = require('path')
const methodOverride=require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError=require('./utils/ExpressError')
const session =require('express-session')


app.use(methodOverride('_method'))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views/listing"))
app.use(express.static(path.join(__dirname,"public/css")))
app.use(express.static(path.join(__dirname,"public/js")))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate);

const listings=require('./routes/listing.js')
const reviews=require('./routes/review.js')

app.use('/listings',listings)
app.use('/listings/:id/reviews',reviews)

//requiring listing model
const listing =require('./models/listing.js')

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then(()=>console.log("Connected to Database"))
    .catch(err=>console.log(err))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"public")))

const sessionOptions = {
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
}
app.use(session(sessionOptions))


const port = 8080;

app.get('/',(req,res)=>{
    res.send("Server Working")
})

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