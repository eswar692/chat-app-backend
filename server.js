const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
app.use(cors())
const cookieParser = require('cookie-parser')
app.use(cookieParser()) 
const route = require('./routes/routes')
app.use(express.json());



app.use('/user',route)








mongoose.connect(process.env.mongo_url)
.then(()=>{console.log('db connected')})


app.listen(3000,()=>{
    console.log('server is running......')
})