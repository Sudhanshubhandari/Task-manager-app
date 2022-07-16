
const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        //Validator->after setting this to true,its compilsory for the user to pass name
         required:true,
         trim:true//automatically removes spaces
    },
    age:{
        default:0,//if ypu do not provide the age it will automatically take the age as 0
        type:Number,
        validate(value){
            if(value<0){
                throw new Error ('Age must be positive')// IT is still not mendatory 
            }
        }
    },
    email:{
        type:String,
        unique:true,
        trim:true,// to eliminate leading and trailing whitespace
        require:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Enter valid email')
            }
        }
     },
    password:{
        type:String,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain password')
            }

        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer// this is going to allow us to store the buffer with our binary image data right in the database
    }
},
{
    timestamps:true
}
)

//MIDDLEWARE

//without middleware    new request-> run route handler
//with middleware       new request->do something->run route handler

//after deleting delete user ,task will automatically delete
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})


// it is not stored in database 
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})


userSchema.methods./*getPublicProfile*/toJSON =function(){
const user=this
const userObject=user.toObject()
delete userObject.password
delete userObject.tokens
delete userObject.avatar
return userObject
}

userSchema.methods.generateAuthToken=async function (){
    const user=this
    // const token=jwt.sign({_id:user._id.toString()},'thisisasecretformyapp')
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save() 
    return token

}


userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email/*:email*/})

    if(!user){
        throw  new Error ('Unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
return user
}


//midlleware function  to make password hashed
userSchema.pre('save', async function (next){
    const user=this
    // console.log('just before save')
    if(user.isModified('password')){
        user.password=  await bcrypt.hash(user.password,8)
    } 

    next()////In order to tell Express when one middleware has finished, you call next() which tells it to move onto the next middleware in the chain.
})

 


const User=mongoose.model('User',userSchema)//storing data in User
// TO add data  or creating instance of it

// const me=new User({
//     name:'Sud',
//     age:27,
//     email:'sudhanshu@gmail.com',
//     password:'sudhanshu123'
// })
// To save file
// me.save().then((/*me or* blank */ ) =>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error',error)
// })

module.exports=User