const User = require('../model/User')
const Message = require('../model/Message')
const { default: mongoose } = require('mongoose')


const searchContact =  async(req,res)=>{
    
    const {userId} = req
    const {searchTerm} = req.body
    

    try {
        if(!userId || !searchTerm){
            return res.status(402).json('userId required')
        }
          const sanitizedText = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
          const regex = new RegExp(`^${sanitizedText}`, 'i');  

        const user =await  User.find(
            {
                $and:[
                    {_id:{$ne:userId}},
                    {
                        $or:[
                            {firstName:regex},
                            {lastName:regex},
                            {email:regex}

                        ]
                    }
                ]
            }
        ).lean();

        if(user.length===0){
            return res.status(404).json("Search result not found")
        }
        return res.status(201).json({contacts:user})    
    } catch (error) {
        console.log(error)
            res.status(501).json('internal server error')        
    }
}



const getContactDM =  async(req,res)=>{
    
    let userId = req.userId._id
    // console.log(userId._id, "hello")
    userId = new mongoose.Types.ObjectId(userId);
    // console.log(userId)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    if(!userId){
        return res.status(402).json('userId required')
    }

    try {
        
  

        const message = await Message.aggregate([
            {$match:{
                $or:[
                    {sender:userId},
                    {recipient:userId}
                ]
            }},
            {
                $sort:{timeStamp:-1} // +1 = ascending order ( Chinna nunchi pedda varaku (small to large)) or -1 = decending order (pedda nunchi china ki (big to small))
            },
            {       // group ante all collection data  group 
                $group:{_id:{
                    $cond:{
                        if: {$eq : ['$sender',userId]},
                        then:'$recipient',
                        else: '$sender'

                    },
                  },
                  lastMessageTime: {$first : "$timeStamp"},
                }
            },
            {
                $lookup:{
                    from: "users", // ekkada model name kadu only database lo collection name enter cheyali 
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                }
            },
            {
                $unwind:"$contactInfo",
               
            }
        ])

        if(message.length === 0){
            return res.status(404).json({message:"No Contacts"})
        }
        return res.status(201).json({message})    
    } catch (error) {
        console.log(error)
            res.status(501).json('internal server error')        
    }
}

module.exports = {searchContact, getContactDM}