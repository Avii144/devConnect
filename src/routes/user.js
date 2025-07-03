const express=require("express");
const { userAuth } = require("../Middlewares/auth");
const userRouter=express.Router();

userRouter.get("/user/connections",userAuth,async(req,res)=>{
     try
});
module.exports=userRouter