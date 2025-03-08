
const {Server}= require('socket.io')


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

      io.on("connection",(socket)=>{
        const userId = socket.handshake.query.userId
        if(userId){
            userObj.set(userId,socket.id)
            console.log(`user connected user ID :${userId} and soket ID:${socket.id}`)
        }else{
            console.log("user id required")
        }


        socket.on('disconnect',()=>disConnect(socket))
      })


      
}



module.exports = socket