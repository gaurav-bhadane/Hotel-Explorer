const express = require('express')
const app = express();
const mongoose =require('mongoose')
const path = require('path')
const methodOverride=require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require('./utils/ExpressError')
const {listingSchema}=require("./schema.js")

app.use(methodOverride('_method'))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views/listing"))
app.use(express.static(path.join(__dirname,"public/css")))
app.use(express.static(path.join(__dirname,"public/js")))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.engine('ejs',ejsMate);

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


const port = 8080;

const validateListing = async (req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    if (error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        console.log(errMsg)
        next( new ExpressError(400,errMsg))
    }
    else{
        next()
    }


}


// app.get('/testlistings',async (req,res)=>{
//     let listing1= new listing ({
//         title: "Gaurav Bhadane",
//         description:"Autobiography",
//         price:499,
//         location:"Nandurbar",
//         country:"India"
//     })
//     await listing1.save()
//         .then(res=>console.log(res))
// })

//INDEX ROUTE

app.get('/listings',wrapAsync(async (req,res)=>{
    let listings = await listing.find()
    res.render("listing/index.ejs",{listings})
}))

//NEW ROUTE

app.get('/listings/new',(req,res)=>{
    res.render("listing/new.ejs")
})

app.post('/listings',validateListing,wrapAsync(async (req,res)=>{
    
    // if (!title || !description || !image || !price || !location || !country) {
    //     throw new ExpressError(400, "Send Valid Data for Listings");
    // }
    let newListing=new listing(req.body.listings);
    console.log(newListing);
    await newListing.save().then(res=>console.log(res))
    // if (!newListing.description){
    //     throw new ExpressError(400, "Description is missing");
    // }
    // if (!newListing.location){
    //     throw new ExpressError(400, "Location is missing");
    // }
    // if (!newListing.country){
    //     throw new ExpressError(400, "Country is missing");
    // }
    
    res.redirect("/listings")
}))

//EDIT ROUTE

app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    res.render("listing/edit.ejs",{listings})
}))

app.put('/listings/:id',validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let {title,description,image,price,location,country}=req.body;
    let updtListing = await listing.findByIdAndUpdate(id,{...req.body.listings},{runValidators:true},{new:true}).then(res=>console.log(res))
    res.redirect(`/listings/${id}`)
}))

//DELETE ROUTE

app.delete('/listings/:id',wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let delListing = await listing.findByIdAndDelete(id);
    res.redirect('/listings')
}))

//SHOW ROUTE

app.get('/listings/:id',wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    res.render("listing/show.ejs",{listings})
}))



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