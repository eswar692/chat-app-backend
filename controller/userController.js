const User = require('../model/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const multer = require('multer')
const cloudinary = require('cloudinary')
const path = require("path");
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store files in 'uploads/' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });



const userRegister = async(req,res)=>{
  
    const {email,password} = req.body
    const emailExist = await User.findOne({email})
        if(emailExist){
            console.log('email exist')
            return res.status(401).json({message:"email already exist plase try another email"})
        }

    const maxAge = 1000 * 60 *60 *24
    
    const jwtFun = (_id)=>{
        return (
            jwt.sign({_id}, process.env.secret_key, {expiresIn:maxAge})
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
    if(!email || !password){
        return res.status(402).json({message:'credinicials required'})
    }

    const maxAge = 1000 * 60 *60 *24
    
    const jwtFun = (_id)=>{
        return (
            jwt.sign({_id}, process.env.secret_key)
        )
    }
    
    try {
        

        const user =await  User.findOne({email})
        const passwordCheck = await bcrypt.compare(password,user.password)
        if(!user ){
            console.log(user,passwordCheck,password)
            return res.status(404).json({meesage:'email and password are incorrect try again later '})
        }

        res.cookie('jwt', jwtFun(user._id),
         {maxAge, secure:true, sameSite:"none"})
         res.status(201).json({user})

        
    } catch (error) {
        console.log(error)
            res.status(501).json({message:"Internal error"})        
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
            return res.status(404).send("Token not valid");
          }
          res.status(201).json({
            id:user._id,
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

const profileDataUpdate = async (req,res)=>{
    const userId = req.userId
    try {
        const {firstName,lastName,color,} = req.body
    
        const user = await User.findByIdAndUpdate(
            userId,
            {firstName,lastName,color,profileSetup:true},
            { new: true, runValidators: true }
        )
        if(!user){
            return res.status(402).json('user id not correct')
        }
    return res.status(201).json(user)
    } catch (error) {
        console.log(error)
        res.status(501).json('internal server error') 
        
    }
}

const profileImage = async(req,res)=>{
    const userId= req.userId

    const file = req.file
   try {
        const user = await User.findById(userId)
        
        

            const result = await cloudinary.v2.uploader.upload(file.path)
            user.image = result.secure_url;
            user.public_id = result.public_id;
           
            await user.save()
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error("File deletion failed:", err);
                } else {
                    console.log("File deleted successfully!");
                }
            });

            res.status(201).json({user})

    
   } catch (error) {
    
    console.log(error)
    res.status(501).json
   }
}


const deleteProfileImage = async (req,res)=>{
    const userId = req.userId
    try {
            const user = await User.findById(userId)
        if(!user){
            return res.status(402).json('user id not correct')
        }
        if(!user.image && !user.public_id) return res.status(404).json('image not there')
        await cloudinary.v2.uploader.destroy(user.public_id)
        user.image = ''
        user.public_id = ''
        await user.save()
        return res.status(201).json('image delete succussfully')
        
    } catch (error) {
        console.log(error)
        return res.status(501).json('server error ...')
        
    }
}

const logout = async(req,res)=>{
    const userId = req.userId
    try {
        const user = await User.findById(userId)
        if(!user) return res.status(404).json('User Not Found')
        
            res.clearCookie("jwt", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
              });
              res.status(201).json('user logout successfully')
        
    } catch (error) {
        console.log(error)
        res.status(501).json('internal server error')       
    }
}



module.exports = {userRegister, 
                  userLogin,
                  getUserData,
                  profileDataUpdate,
                  upload,
                  profileImage,
                  deleteProfileImage,
                  logout
                }