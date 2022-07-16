
const mongoose=require('mongoose')
const validator=require('validator')


const taskSchema=new mongoose.Schema({
    description:{
        type:String 
       
     } ,  
          completed:{
            type:Boolean

    },
    owner:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
    }
},{
    timestamps:true
})
const Task=mongoose.model('Task',taskSchema)

// const Task=mongoose.model('Task',{
//     description:{
//         type:String 
       
//      } ,  
//           completed:{
//             type:Boolean

//     },
//     owner:{
//     type: mongoose.Schema.Types.ObjectId,
//     required:true,
//     ref:'User'
//     }

// })

// const me=new Task({
//     description:'Learn the Mongoose library',
//     completed:false

// })
// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log('Error',error)
// })
module.exports=Task