const User = require('../model/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userRegister = async(req,res)=>{
    console.log(req.body)
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

module.exports = {userRegister}