const express=require('express');
const {join} = require('path');


const listRouter=express.Router();

//server list of tasks
let listOfTasks=[];

let numberOfTasks=0;

//updates list on server side 
listRouter.post('/create',(req,res)=>{
    listOfTasks=[...req.body];
    console.log(listOfTasks);
    numberOfTasks=listOfTasks.filter(elem=>elem.isCompleted==false).length;
    res.json({numberOfTasks});
})
//loads page of active tasks
.get('/active',(req,res)=>{
    console.log(listOfTasks);
    res.sendFile(join(__dirname,"../",'public','active.html'));
})
//filters only active tasks and return it to user side
.post('/active',(req,res)=>{
    const activeTasks=listOfTasks.filter(element=>element.isCompleted==false);
    res.json(activeTasks);
})
//sends full list to user side
.get('/getList',(req,res)=>{
    res.json(listOfTasks);
})
//loads page of completed tasks
.get('/completed',(req,res)=>{
    res.sendFile(join(__dirname,"../",'public','completed.html'))
})
//filters only completed tasks and returns it to user side
.post('/completed',(req,res)=>{
    const activeTasks=listOfTasks.filter(element=>element.isCompleted==true);
    res.json(activeTasks);
})


module.exports={
    listRouter,
}