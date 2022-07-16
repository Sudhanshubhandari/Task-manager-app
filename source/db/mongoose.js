const mongoose=require('mongoose')

//Old command 
   /*mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser:true,
    useCreateIndex:true  //useCreateIndex: Again previously MongoDB used an ensureIndex function call to ensure that Indexes exist and, if they didn't, to create one.
})*/


//new command 
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')
mongoose.connect(process.env.MONGODB_URL)



