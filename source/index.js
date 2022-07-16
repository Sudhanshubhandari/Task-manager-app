 
const express = require('express')
require('./db/mongoose')
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const auth=require('../source/middleware/auth')
const app = express()
const port = process.env.PORT 

// cutomised middleware function(used when site is under contruction)
// app.use((req,res,next)=>{
//     if(req.method==='GET'){
//         res.send('Get request are disabled')
//     }
//     else{
//         next()//by this program will run normally 
//     }
// })

//for all methods 
// app.use((req,res,next)=>{
//     res.status(503).send('Site is under maintainance')
// })



//parse incoming json for us (in this from postman)
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// Securing passwords with bcrypt
// const myFunction=async()=>{
//     const password='Red1234!'
//     const hashedpass= await bcrypt.hash(password,/*saltround*/8)
//     console.log(password)
//     console.log(hashedpass)

//     const isMatch=await bcrypt.compare('Red1234!',hashedpass)
//     console.log(isMatch)

// }
// myFunction()

//Json web tokens


// const myFunction=async()=>{
// const token=jwt.sign(/*by which you want to be targeted*/{_id:'abc123'},'thisismynewcource',{expiresIn:'7 days'})
// console.log(token)
// const data=jwt.verify(token,'thisismynewcource')
// console.log(data)

// }
// myFunction()



app.listen(port, () => {
    console.log('Server is up to port ' + port)
})
//Finding user from task

// const Task=require('./models/task')
// const main=async()=>{
// const task=await Task.findById('62cb28095fdf2ea46f9ebfb8')
// await task.populate('owner')//after this task.owner will print whole data of user instead of id
// console.log(task.owner)
// }
// main()


//finding task from user

// const User=require('./models/user')
// const main=async()=>{
//     const user=await User.findById('62cd17b2baaf21fb2de8370a')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }
// main()


// Upload a image

// const multer=require('multer')
// const upload=multer({
//     dest:'images',//destination
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a Word document'))
//         }
//         cb(undefined,true)

//     }
// })
// app.post('/upload',upload.single(/*value you will put in key in postman*/ 'upload'),(req,res)=>{
//     res.send()
// },
// (error,req,res,next)=>{//If you only have three arguments, then Express thinks you're doing (req, res, next) => { } , by using four arguments, you let Express know that this middleware handles errors.
//     res.status(400).send({error:error.message})
// })