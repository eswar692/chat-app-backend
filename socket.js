
const {Server}= require('socket.io');
const Message = require('./model/Message');


const socket = (server)=>{
    const io = new Server(server, {
        cors: {
          origin: "http://localhost:5173", // React frontend URL
          methods: ["GET", "POST"],
          credentials: true // httpOnly Cookie must
        },
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

      }

      io.on("connection",(socket)=>{
        const userId = socket.handshake.query.userId
        if(userId){
            userObj.set(userId,socket.id)
            console.log(`user connected user ID :${userId} and soket ID:${socket.id}`)
        }else{
            console.log("user id required")
        }

        socket.on('sendMessage',sendMessage)


        socket.on('disconnect',()=>disConnect(socket))
      })


      
}



module.exports = socket