
const {Server}= require('socket.io');
const Message = require('./model/Message');
const { default: mongoose } = require('mongoose');


const socket = (server)=>{
    const io = new Server(server, {
        cors: {
          origin: "https://chat-app-alpha-weld.vercel.app/", // React frontend URL
          methods: ["GET", "POST"],
          credentials: true, // httpOnly Cookie must
        },
        transports: ["websocket"],
      });

      const userObj = new Map()

      const disConnect = (socket)=>{
        console.log("user disconnected socket id: ",socket.id)
        for(const {userId,socketId} of userObj.entries()){
            if(socketId === socket.id){
                userObj.delete(userId)
                break;
            }
        }
      }

      const sendMessage =async (message)=>{
        try {
            const senderSocketId = userObj.get(message.sender)
            const recipientSocketId = userObj.get(message.recipient)

            const storeMessage = await Message.create(message)
            const messageData = await Message.findById(storeMessage._id)
            .populate('sender',"id email firstName LastName image color")
            .populate('recipient',"id email firstName LastName image color")

            if(recipientSocketId){
              io.to(recipientSocketId).emit('recieveMessage',message)
            }
            if(senderSocketId){
              io.to(senderSocketId).emit('recieveMessage',message)
            }

        } catch (error) {
          console.log('error',error.message)
          io.emit("error", { message: "Failed to send message. Please try again." });

          
        }
      }
      // const contactDM = async()=>{
      //   try {
         
      //   const userId = new mongoose.Types.ObjectId(userId)
      //   const senderSocketId = userObj.get(id)


      //   const message = await Message.aggregate([
      //     {$match:{
      //         $or:[
      //             {sender:userId},
      //             {recipient:userId}
      //         ]
      //     }},
      //     {
      //         $sort:{timeStamp:-1} // +1 = ascending order ( Chinna nunchi pedda varaku (small to large)) or -1 = decending order (pedda nunchi china ki (big to small))
      //     },
      //     {       // group ante all collection data  group 
      //         $group:{_id:{
      //             $cond:{
      //                 if: {$eq : ['$sender',userId]},
      //                 then:'$recipient',
      //                 else: '$sender'

      //             },
      //           },
      //           lastMessageTime: {$first : "$timeStamp"},
      //         }
      //     },
      //     {
      //         $lookup:{
      //             from: "users", // ekkada model name kadu only database lo collection name enter cheyali 
      //             localField: "_id",
      //             foreignField: "_id",
      //             as: "contactInfo",
      //         }
      //     },
      //     {
      //         $unwind:"$contactInfo",
             
      //     }
      // ])

      // socket.emit('recieveContact', message)
          
      //   } catch (error) {
      //     console.log('error',error.message)
      //     io.emit("error", { message: "Failed to send message. Please try again." });
          
      //   }

      // }

      io.on("connection",(socket)=>{
        const userId = socket.handshake.query?.userId
        if(userId){
            userObj.set(userId,socket.id)
            console.log(`user connected user ID :${userId} and soket ID:${socket.id}`)
        }else{
            console.log("user id required")
        }

        socket.on('sendMessage',sendMessage)
        // socket.on('sendContact', contactDM)


        socket.on('disconnect',()=>disConnect(socket))
      })


      
}



module.exports = socket