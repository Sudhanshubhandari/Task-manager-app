const User = require('../models/user') 
const express=require('express')
const router=new express.Router()
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancelationEmail}=require('../emails/Node mailer/index')

//creating new router , always do this in separate file to be organised

router.get('/test',(req,res)=>{
    res.send('This is my new router')
})
// app.use(router)//regitering or saving it

// Normal method
// app.post(/*whatever you want to write after localhost:3000/  */'/users', (req, res) => {
    // console.log(req.body)
    // res.send('testing!')

    // const user = new User(req.body)
    // user.save().then(() => {
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)

    // })


    //Async await method
    router.post('/users', async(req, res) => {
        const user=new User(req.body)
        try{ 
            await user.save()//data will go to mongodb
            sendWelcomeEmail(user.email,user.name)
            const token=await user.generateAuthToken()    
            res.status(201).send({user,token})
        }
        catch(e){
            res.status(400).send(e)
        }
    })
    
    
    //LOGIN OF USER
    //we passes middleware as an argument
    router.post('/users/login',async(req,res)=>{
        try{
            const user=await User.findByCredentials(req.body.email,req.body.password)
            const token=await user.generateAuthToken()
            res.send({user/*:user.getPublicProfile()*/,token})
            // res.status(200).send({user,token})
        }catch(e){
            res.status(400).send()
        }

    })

    //Logout of user

    router.post('/user/logout',auth,async(req,res)=>{
        try{
            req.user.tokens=req.user.tokens.filter((token)=>{
                return token.token!=req.token
            })
            await req.user.save()
            res.send()
        }
        catch(e){
            res.status(500).send()
        }
    })

    //Logout all
    router.post('/users/logoutall',auth,async(req,res)=>{
       try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
       } catch(e){
        res.status(500).send()
       }
    })
    
    
    // router.get('/users', (req, res) => {
    //     // normal method
    //     User.find(/*All data*/{}).then((users) => {
    //         res.send(users)
    //     }).catch((e)=>{
    //         res.send(e)
    //     })
    // })
    
        
    // })
    
    // by async await
    router.get('/users',async(req, res) => {
        try{
            const data=await User.find({})
            res.send(data)
        }catch(e){
            res.status(500).send()
        }
    })

    router.get('/users/me',auth ,async(req, res) => {
       
      res.send(req.user)
    })

    //for particular profile

    
    //checking data by id by normal method
    // router.get('/users/:id', (req, res) => {
    //     const _id = req.params.id
    //     User.findById(_id).then((data) => {
    //         if (!data) {
    //             return res.status(404).send()
    //         }
    //         res.send(data)
    //     }).catch((e) => {
    //         res.status(500).send()
    //     })
    // })
    
    router.get('/users/:id',async(req,res)=>{
        const _id=req.params.id
        try{
            const user=await User.findById(_id)
            if(!user){
                return res.status(404).send()
            }
            res.send(user)
        }catch(e){
            res.status(500).send()
        }
    })
    
    
    //TO update
    //PATCH is commonly used to update subset of fields without removing others. PUT is commonly used to completely replace all object fields with the new data. 
    
    // router.patch('/users/:id',async (req,res)=>{

    //     const updates=Object.keys(req.body)
    // const allowedUpdates=['name','email','password','age']
    // const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    // if(!isValidOperation){
    //     return res.status(400).send({error:'Invalid updates!'})
    // }
    //     try{
    //         const user=await User.findById(req.params.id)
    //         updates.forEach((update)=>
    //             user[update]=req.body[update])
    //             await user.save()

    //         // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true /*when u update for 2nd time this will help */ ,runValidators:true})
    //         if(!user){
    //             return res.status(404).send()
    //         }
    //         res.send(user)
    //     }catch(e){
    //         res.status(400).send(e)
    //     }
    
    // })

    // update with authentication 
    router.patch('/users/me',auth,async (req,res)=>{

        const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }
        try{
           
            updates.forEach((update)=>
                req.user[update]=req.body[update])
                await req.user.save()
             

            // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true /*when u update for 2nd time this will help */ ,runValidators:true})
            res.send(res.user)
        }catch(e){
            res.status(400).send(e)
        }
    
    })
    
    
    router.delete(/*users/:id*/'/users/me',auth,async(req,res)=>{   // before auth its :id after using auth its /me
        try{
            const user=await User.findByIdAndDelete(/*req.params.id*/req.user._id)//since we are using auth so we can use user.id instead of req.param.id
            // if(!user){
            //     return res.status(404).send()
            // }
            //after auth
            await req.user.remove()
            sendCancelationEmail(req.user.email,req.user.name)
            // res.send(user)
            res.send(req.user)
        }
        catch(e){
            res.send(500).send()
        }
    })

    //Uploading image 

//     const upload =multer({
//         dest:'avatars',
//         limits:{
//             fileSize:1000000

//         },
    
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//             return cb(new Error('Please upload an image'))
//         }
//         cb(undefined,true)
//     }
// })


//     router.post('/users/me/avatar',upload.single('avatar'),(req,res)=>{ 
//         res.send()},
//         (error,req,res,next)=>{
//             res.status(400).send({error:error.message})
        
//     })

//Uploading file with binary data
const upload =multer({
    limits:{                           
        fileSize:1000000
    },
fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('Please upload an image'))
    }
    cb(undefined,true)
}
})
// router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{ 
//     req.user.avatar=req.file.buffer

//     await req.user.save()
//     res.send()},
//     (error,req,res,next)=>{
//         res.status(400).send({error:error.message})
    
// })

//Resize image and coversion using sharp
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{ 
   const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
   req.user.avatar=buffer

    await req.user.save()
    res.send()},
    (error,req,res,next)=>{
        res.status(400).send({error:error.message})
    })


//Delete avatar
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

//Get avatar
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch(e){
        res.status(404).send()
    }
})


module.exports=router
