const express = require('express')
const app = express();
const mongoose =require('mongoose')

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then(()=>console.log("Connected to Database"))
    .catch(err=>console.log(err))

const path = require('path')
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"public")))


const port = 8080;

app.get('/',(req,res)=>{
    res.send("Server Working")
})

app.listen(port,(req,res)=>{
    console.log(`App Listening on Port ${port}`)
})