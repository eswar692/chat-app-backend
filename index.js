const express = require('express')
const app = express()
app.use(express.json());
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const cookieParser = require('cookie-parser')
app.use(cookieParser()) 
app.use(cors({
    origin: "https://chat-app-alpha-weld.vercel.app/", // Set to your frontend URL
    credentials: true  // Important for cookies!
}));
const route = require('./routes/routes')
const contactRoute = require('./routes/contactRoute')
const cloudinary = require('cloudinary')
const socket = require('./socket')
const messageRoute = require('./routes/messageRoutes')

app.use('/user',route)
app.use('/search',contactRoute)
app.use('/message',messageRoute)


cloudinary.v2.config({
    cloud_name:process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret:process.env.api_secret
})






mongoose.connect(process.env.mongo_url,
    {
        maxPoolSize: 50,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        serverSelectionTimeoutMS: 50000, // Default 30000, increase to 50000
        socketTimeoutMS: 60000 // Increase timeout
    }
)
.then(()=>{console.log('db connected')})

const port = process.env.PORT || 5000
const server = app.listen(port,()=>{
    console.log('server is running......')
})

socket(server)