const mongoose =require('mongoose')
const initData = require("./data.js")
const listing = require("../models/listing.js")
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then(()=>console.log("Connected to Database"))
    .catch(err=>console.log(err))



const initDB = async ()=>{
    await listing.deleteMany({})
    initData.data=initData.data.map((obj)=> ({
        ...obj,owner: "65d323af5d0ec514b13a9100"
    }))
    await listing.insertMany(initData.data)
    console.log("Data was Initialised")
}

initDB()
