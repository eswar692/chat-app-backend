const User = require('../model/User')


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

module.exports = {searchContact}