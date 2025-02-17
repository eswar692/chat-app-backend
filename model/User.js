const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true      
    },
    firstName:{
        type:String,
        required:false,   
    },
    lastName:{
        type:String,
        required:false,   
    },
    image:{
        type:String,
        required:false,   
    },
    color:{
        type:Number,
        required:false,   
    },
    profileSetup:{
        type:Boolean,
        default:false,   
    }
})

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
    this.password =await bcrypt.hash(this.password,salt)
    next()  
    } catch (error) {
        console.log(error)
        next(error)
    }  
})

const User = mongoose.model('User',userSchema)
module.exports = User