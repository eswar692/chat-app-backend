const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = async (req,res,next)=>{
    const token = req.cookies.jwt 
    try {
        if(!token){
            return res.status(401).json('token is required!...')
        }
        const userId = await jwt.verify(token,process.env.secret_key)
        req.userId = userId
    next()
   } catch (error) {
        console.log(error);
        return res.status(404).json('internal error or token error')
        
   }

} 
module.exports = verifyToken