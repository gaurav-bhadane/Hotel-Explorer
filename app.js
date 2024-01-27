const express = require('express')
const app = express();
const mongoose =require('mongoose')
const path = require('path')

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views/listing"))

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

app.get('/listings',async (req,res)=>{
    let listings = await listing.find()
    res.render("listing/index.ejs",{listings})
})

app.get('/',(req,res)=>{
    res.send("Server Working")
})

app.listen(port,(req,res)=>{
    console.log(`App Listening on Port ${port}`)
})