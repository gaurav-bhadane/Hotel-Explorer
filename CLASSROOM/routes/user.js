const express=require('express')
const router=express.Router()

//USERS

router.get('/',(req,res)=>{
    res.send("Get Request for Users")
})
router.get('/:id',(req,res)=>{
    res.send("Show Request for Users")
})
router.post('/',(req,res)=>{
    res.send("POST request for users")
})
router.delete('/:id',(req,res)=>{
    res.send("DELETE request for users")
})

module.exports=router