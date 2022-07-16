// to run data base command use =>/Users/Ashish/mongodb/bin/mongod.exe --dbpath=/Users/Ashish/mongodb-data
// //CRUD -create read  update delete
// const mongodb=require('mongodb')
// const MongoClient=mongodb.MongoClient        //gives access to the functions neccesary to connect to the database

// //step 1.-> gives connection URL abd database we are trying to connect

// const connectURL='mongodb://127.0.0.1:27017'
// const databaseName='task-Manager'

// MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
//     if(error){
//         return console.log('Unable to connect to database!')
//     }
//     //Insertion 

//     // console.log('Connected correctly')

//     const db=client.db(databaseName) // db used to target specific database for ex task manager in this case
//     //Inserting one user 
// //     db.collection(/*inside databasename this File name stored in mongodatabase*/'user').insertOne({
// //         name:'Andrew',
// //         age:27
// //     },/*callback function*/(error,result)=>{
// //         if(error){
// //             return console.log('Unable to insert user')
// //         }
// //         console.log(result.ops)//ops is a property contain id_ field (refer documentation on mongo db for further details)
// //     }   )
// // })


// //inserting more than one document 
// db.collection('user').insertMany([
//     {
//     name:'Andrew',
//     age:27},{
//     name:'Sud',
//     age:21
//     }
// ],(error,result)=>{
//     if(error){
//         return console.log('Unable to insert user')
//     }
//     console.log(result.ops)
// }   )
// })
//------------------------------------------------------------------------------------------


//Create a unique  object id

// const mongodb=require('mongodb')
// const MongoClient=mongodb.MongoClient
//const ObjectID=mongodb.ObjectID
//       OR
//Object destructing

const { MongoClient, ObjectID } = require('mongodb')


const connectURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-Manager'
// const id=new ObjectID()// generate us the new id 
// console.log(id)
// console.log(id.id)//gives raw binary information like 5c 65 63 54 55 47
//console.log(id.id.length)//give length
//console.log(id.toHexString().length) //gives double length


// console.log(id.getTimestamp())//give the time in id

// MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
//     if(error){
//         return console.log('Unable to connect to database!')
//     }


//     const db=client.db(databaseName)
//     db.collection(/*inside databasename this File name stored in mongodatabase*/'user').insertOne({
//         _id:id,//same id in mongocompass as coming in terminal
//                 name:'Vikram',
//                 age:27
//             },/*callback function*/(error,result)=>{
//                 if(error){
//                     return console.log('Unable to insert user')
//                 }
//                 console.log(result.ops)//ops is a property contain id_ field (refer documentation on mongo db for further details)
//             }   )
//         }) 



//--------------------------------------------------------------------------------------------------


//Find Functionnn

MongoClient.connect(connectURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }
    const db = client.db(databaseName);
    // for one user
    // db.collection(/*file name where you want to search*/ 'user').findOne({/*Argument by which you have to find*-> but if you want to search by id then instead of giving direct id give _id:new ObjectID("whatever id is")  */ name:'Sud'},(error,/*whaterver you like*/users)=>{
    //     if(error){
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(users)
    // })

    //for multiple user
    // db.collection('user').find({age:27}).toArray((error,users)=>{//toArray is a function of find as find always return the cursor 
    //     console.log(users)
    // })
    // db.collection('user').find({age:27}).count((error,users)=>{//count is a function of find as find always return the cursor 
    //     console.log(users)
    // })
    db.collection('user').find({ completed: true }).toArray((error, tasks) => {
        console.log(tasks)
    })
})

//------------------------------------------------------------------------------------------
//Update function


MongoClient.connect(connectURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }
    const db = client.db(databaseName);
    const updatepromise = db.collection('user').updateOne(/*target by */{
        _id: new ObjectID("62b567a4a90d4e297808a041"),
    }, {
     /*whatever you want to change*/   $set: {
            name: 'bikram'
        }
    })
updatepromise.then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
})
})

//or

MongoClient.connect(connectURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }
    const db = client.db(databaseName);
    const updatepromise = db.collection('user').updateOne(/*target by */{
        _id: new ObjectID("62b567a4a90d4e297808a041"),
    }, {
     /*whatever you want to change*/  
     $inc:{
        age:1 /* or -1*/
     }
    })
updatepromise.then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
})
})


// Deleting

MongoClient.connect(connectURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }
    const db = client.db(databaseName);
   db.collection('user').deleteMany(/*target by */{
        age:21
    
   
    }).then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
})
})





