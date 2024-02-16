import express from "express"
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import colors from "colors"
import userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import cors from "cors"
import { Server } from "socket.io";
import { createServer } from 'node:http';



dotenv.config({
    path: ".env",
  });

connectDB()
const app = express()

const port = process.env.PORT || 4000

app.use(express.json()) ;
app.use(cors())


app.get('/',(req,res)=>{
    res.send("api is running")
})



app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
app.use(notFound)
app.use(errorHandler)



const server = createServer(app);

server.listen(port,()=>{
    console.log(`server is running ${port}`.yellow.bold)
})


const io = new Server(server,{
    pingTimeout:60000,
    cors:{
        origin : "*"
    }
});


io.on("connection",(socket)=>
{
    socket.on("setup", (userData) => 
    {
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });


    socket.on("new message", (newMessageRecieved) => 
    {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => 
        {
           if (user._id == newMessageRecieved.sender._id) return;
    
           socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
})

