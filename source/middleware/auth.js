const jwt=require('jsonwebtoken')
const User=require('../models/user')
//making this separate file so that we can add this to seprate files instead of whole i.e)we dont want to add thses in sign up and login 

const auth=async(req,res,next)=>{
   try{
    const token=req.header('Authorization').replace('Bearer ','')
    // const decoded=jwt.verify(token,'thisisasecretformyapp')
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user=await User.findOne({_id:decoded._id,'tokens.token':token /*is current token value is present in tokens array or not*/})
    if(!user){
      throw new Error()
    }
    //if it is running ok
    req.token=token//targeting above particular token 
    req.user=user
    next()
   }
   catch(e){
    res.status(401).send({error:'Please authenticate.'})
   }

}
module.exports=auth