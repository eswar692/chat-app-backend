const express = require('express')
const app = express()
app.use(express.json());
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const cookieParser = require('cookie-parser')
app.use(cookieParser()) 
app.use(cors({
    origin: "http://localhost:5173", // Set to your frontend URL
    credentials: true  // Important for cookies!
}));


const route = require('./routes/routes')

const cloudinary = require('cloudinary')


app.use('/user',route)

cloudinary.v2.config({
    cloud_name:process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret:process.env.api_secret
})






mongoose.connect(process.env.mongo_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(()=>{console.log('db connected')})


app.listen(3000,()=>{
    console.log('server is running......')
})