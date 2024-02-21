const listing=require('../models/listing.js')

module.exports.index= async (req,res)=>{
    let listings = await listing.find({})
    res.render("listing/index.ejs",{listings})
}

module.exports.new=(req,res)=>{
    res.render("listing/new.ejs")
}

module.exports.newpost=async (req,res)=>{
    let newListing=new listing(req.body.listings);
    newListing.owner=req.user._id;
    console.log(newListing);
    await newListing.save().then(res=>console.log(res))
    req.flash("success","New Listing Created")
    res.redirect("/listings")
}

module.exports.getedit=async(req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    if (!listings){
        req.flash("error","Listing does not exist");
        res.redirect("/listings")
    }
    res.render("listing/edit.ejs",{listings})
}

module.exports.putedit=async (req,res)=>{
    let {id}=req.params;
    let {title,description,image,price,location,country}=req.body;
    let listings =await listing.findById(id);
    let updtListing = await listing.findByIdAndUpdate(id,{...req.body.listings},{runValidators:true},{new:true}).then(res=>console.log(res))
    req.flash("success","Listing Updated")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteRoute=async(req,res)=>{
    let {id}=req.params;
    let delListing = await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
    res.redirect('/listings')
}

module.exports.showget= async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id).populate({path : "reviews",
        populate : {
            path:"author",
        }
    }).populate("owner");
    if (!listings){
        req.flash("error","Listing does not exist");
        res.redirect("/listings")
    }
    console.log(listings)
    res.render("listing/show.ejs",{listings})
}