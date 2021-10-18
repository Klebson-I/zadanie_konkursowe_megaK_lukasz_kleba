const express=require('express');
const {join} =require('path');
const {listRouter} =require('./routes/list.js');

const app=express();
app.use(express.json());
app.use(express.static('public'));
app.use('/list',listRouter);

//default site 
app.get('/',(req,res)=>{    
    res.sendFile(join(__dirname,'public/index.html'));
})

app.listen(3000);