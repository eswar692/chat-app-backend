const User = require('../model/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcryptjs')


const userRegister = async(req,res)=>{
  
    const {email,password} = req.body
    

    const maxAge = 1000 * 60 *60
    
    const jwtFun = (_id)=>{
        return (
            jwt.sign(_id, process.env.secret_key, {expiresIn:maxAge})
        )
    }
    
    try {
        if(!email || !password){
            return res.status(402).json('credinicials required')
        }

        const user =  User({email,password})
        await user.save()
        res.cookie('jwt', jwtFun(user._id),
         {maxAge, secure:true, sameSite:"none"})
         res.status(201).json({user})

        
    } catch (error) {
        console.log(error)
            res.status(501).json('internal server error')        
    }
}

const userLogin =  async(req,res)=>{
    
    const {email,password} = req.body
    

    const maxAge = 1000 * 60 *60 *24
    
    const jwtFun = (_id)=>{
        return (
            jwt.sign({_id}, process.env.secret_key)
        )
    }
    
    try {
        if(!email || !password){
            return res.status(402).json('credinicials required')
        }

        const user =await  User.findOne({email})
        const passwordCheck = bcrypt.compare(password,user.password)
        if(!user || !passwordCheck){
            return res.status(404).json('email and password are incorrect try again later ')
        }

        res.cookie('jwt', jwtFun(user._id),
         {maxAge, secure:true, sameSite:"none"})
         res.status(201).json({user})

        
    } catch (error) {
        console.log(error)
            res.status(501).json('internal server error')        
    }
}

const getUserData = async(req,res)=>{
    
    const token = req.cookies.jwt
    
    
    try {
        if (!token) {
            return res.status(401).send("No token found");
          }
          const tokenConvertId = jwt.verify(token, process.env.secret_key)
          
          const user = await User.findById(tokenConvertId)
          if(!user){
            return res.status(404).send("Token valid");
          }
          res.status(201).json({
            email : user.email,
            firstName :user.firstName,
            lastName : user.lastName,
            image : user.image,
            color : user.color,
            profileSetup: user.profileSetup


          })
        

        
    } catch (error) {
        console.log(error)
            res.status(501).json('internal server error')        
    }
}
module.exports = {userRegister, userLogin,getUserData}