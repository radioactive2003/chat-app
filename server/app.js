import express from "express";
import {Server} from "socket.io";

const app =express();
const port = 8080;
const ADMIN ="Admin";
const server = app.listen(port,()=>{
    console.log(`listening on ${port}`);
})
const io = new Server(server,{
    cors:"*"
})
 
 // connection established
    io.on('connection',(socket)=>{
    console.log(`user ${socket.id}` )

    //emit to only the user connected
    socket.emit('message',"welcome to the chat app!");

    socket.on('enter-room',({room,name})=>{
        socket.join(room);
        
        io.emit('update-room',room);
        //broadcast to all others connected not the user
        io.broadcast.emit('connected', name);

    })
      //listening for a message event from server
      socket.on('message',({name,room,text})=>{
        console.log(name,room);
        io.to(room).emit('message',{
            name,
            text,
            time:new Intl.DateTimeFormat('default',{
            hour:'numeric',
            minute:'numeric',
            second:'numeric'
        }).format(new Date())})
    })
   
    //when the user is disconnected display msg to others
    socket.broadcast.emit('disconnected',`${socket.id} is disconnected`);
    //listens the activity
    socket.on('activity',(name)=>{
        socket.broadcast.emit('activity',name);
        
    })
})

