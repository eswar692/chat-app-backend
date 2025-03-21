const multer = require("multer");
const Message = require("../model/Message");
const fs = require('fs')
const path  = require('path')
const cloudinary = require('cloudinary')






const getAllMessages = async (req, res)=>{
    const user1 = req.userId
    const user2 = req.body.id
    try {
      if(!user1 || !user2){
        return res.status(400).json({message:"Both users required"})
      }
      const message = await Message.find({
        $or:[
          {sender:user1, recipient:user2},
          {sender:user2, recipient:user1},

        ]
      }).sort({timeStamp:1})

      return res.status(201).json({message})
      
    } catch (error) {
      console.log(error)
      return res.status(501).json({message:"internal server error"})
      
    }
}

const fileMessage =async (req, res) => {
    const userId= req.userId
    const file = req.file
    console.log(file, userId)
    if(!userId || !file){
      return res.status(401).json({message:"user id required"})
    }
  try {
       const result = await cloudinary.v2.uploader.upload(file.path)
       const fileUrl = result.secure_url;
       const publicId = result.public_id;
       if(result){
        
        fs.unlink(file.path, (err) => {
                        if (err) {
                            console.error("File deletion failed:", err);
                        } else {
                            console.log("File deleted successfully!");
                        }
                    });
        return res.status(201).json({file:{fileUrl,publicId}})
       }

  } catch (err) {
    res.status(500).json({  error: err.message });
  }
};






// edi only development lo ne 
const deleteAllMessage =async (req, res) => {
    try {
      const result = await Message.deleteMany({});
      res.json({ success: true, deletedCount: result.deletedCount });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };


  module.exports = {deleteAllMessage, getAllMessages, fileMessage}