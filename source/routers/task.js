const Task = require('../models/task')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

// router.get('/tasks', (req, res) => {
//     Task.find({}).then((data) => {
//         res.send(data)
//     }).catch((e) => {
//         res.send(500).send()
//     })
// })

// router.get('/tasks',auth,async(req,res)=>{
//     try{
//         // const tasks=await Task.find({owner:req.user._id})
//        // res.send(tasks)
//         //OR
//         await req.user.populate('tasks')

//         res.send(req.user.tasks)
//     }catch(e){
//         res.status(500).send()
//     }
// })

//by making condition check wheteher task is completed or not
//task?completed=true
//limits will tell you how many number of users you will see on 1 page
//skips help us to skip numbers of users (skip=0=>page 1)   /tasks?limits=1&skip=0

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort={}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    try {

        await req.user.populate({ //the process of replacing the specified path in the document of one collection with the actual document from the other collection.
            path: 'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        })

        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})



// router.get('/tasks/:id',(req,res)=>{
//     const _id=req.params.id
//     Task.findById(_id).then((task)=>{
//         if(!task){
//             return res.status(404).send
//         }
//         res.send(task)
//     }).catch((e)=>{
//         res.status(500).send()
//     })
// })


// router.get('/tasks/:id',async(req,res)=>{
//     const _id=req.params.id
//      try{
//         const task=await Task.findById(_id)
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//      }
//      catch(e){
//         res.status(500).send(e)
//      }
// })

// using auth
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})








// router.post('/tasks', (req, res) => {
//     const task = new Task(req.body)
//     task.save().then(() => {
//         res.status(201).send(task)
//     }).catch((e) => {
//         res.status(400).send(e)

//     })
// })

// router.post('/tasks',async(req,res)=>{
//     const task=new Task(req.body)
//     try{
//         await task.save()
//         res.status(201).send(task)
//     }catch(e){
//         res.status(404).send(e)
//     }
// })
//using auth
router.post('/tasks', auth, async (req, res) => { // this to run you should be logined with user
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(404).send(e)
    }
})

// router.patch('/tasks/:id',async(req,res)=>{
//     const updates=Object.keys(req.body)
//     const allowedUpdates=['description','completed']
//     const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(400).send({error:'Invalid updates!'})
//     }
//     try{
//         const task=await Task.findbyId(req.params.id)
//         updates.forEach((update)=>task[update]=req.body[update])
//         await task.save()
//         // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })


// Using auth

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})



// router.delete('/tasks/:id',async(req,res)=>{
//     try{
//         const task=await Task.findByIdAndDelete(req.params.id)
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }
//     catch(e){
//         res.send(500).send()
//     }
// })

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router