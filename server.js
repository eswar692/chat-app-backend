const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
app.use(cors({
    origin: "http://localhost:5173", // Set to your frontend URL
    credentials: true  // Important for cookies!
}));
const cookieParser = require('cookie-parser')
app.use(cookieParser()) 
const route = require('./routes/routes')
app.use(express.json());
const cloudinary = require('cloudinary')


app.use('/user',route)








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