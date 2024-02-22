const express=require('express')
const router=express.Router()

//POSTS

router.get('/',(req,res)=>{
    res.send("Get Request for Posts")
})
router.get('/:id',(req,res)=>{
    res.send("Show Request for Posts")
})
router.post('/',(req,res)=>{
    res.send("POST request for Posts")
})
router.delete('/:id',(req,res)=>{
    res.send("DELETE request for posts")
})

module.exports=router