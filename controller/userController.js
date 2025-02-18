const User = require('../model/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userRegister = async(req,res)=>{
  
    const {email,password} = req.body
    

    const maxAge = 1000 * 60 *60
    
    const jwtFun = (email,password)=>{
        return (
            jwt.sign({email,password}, process.env.secret_key, {expiresIn:maxAge})
        )
    }
    
    try {
        if(!email || !password){
            return res.status(402).json('credinicials required')
        }

        const user =  User({email,password})
        await user.save()
        res.cookie('jwt', jwtFun(user.email,user.password),
         {maxAge, secure:true, sameSite:"none"})
         res.status(201).json({user})

        
    } catch (error) {
        console.log(error)
            res.status(501).json('internal server error')        
    }
}

const userLogin =  async(req,res)=>{
    
    const {email,password} = req.body
    

    const maxAge = 1000 * 60 *60
    
    const jwtFun = (email,password)=>{
        return (
            jwt.sign({email,password}, process.env.secret_key, {expiresIn:maxAge})
        )
    }
    
    try {
        if(!email || !password){
            return res.status(402).json('credinicials required')
        }

        const user =  User.findOne({email})
        if(!user){
            return res.status(404).json('email and password are incorrect try again later ')
        }

        await user.save()
        res.cookie('jwt', jwtFun(user.email,user.password),
         {maxAge, secure:true, sameSite:"none"})
         res.status(201).json({user})

        
    } catch (error) {
        console.log(error)
            res.status(501).json('internal server error')        
    }
}
module.exports = {userRegister}