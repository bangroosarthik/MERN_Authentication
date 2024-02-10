const express=require('express');
const dotenv=require('dotenv').config()
const cors=require('cors')
const {mongoose}=require('mongoose');
const cookieParser = require('cookie-parser');
const app=express();

 

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('MONGODB Database Connected!')
})
.catch((err)=>{
    console.log("Database not connected",err);
})

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

const port=8000;

app.use('/',require('./routes/authRoutes'))



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
