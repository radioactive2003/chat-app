import express from "express";
// import {createServer} from "http";//if not using express
import {Server} from "socket.io";
// import {WebSocketServer} from "ws";

const app =express();
const port = 8080;
const ADMIN ="Admin";
const server = app.listen(port,()=>{
    console.log(`listening on ${port}`);
})
const io = new Server(server,{
    cors:"*"
})
 //USER STATE
 const userState ={
    users:[],
     setUser: function(userArray){
        this.users = userArray;
     }

 }
 io.on('connection',(socket)=>{
    console.log(`user ${socket.id}` )

    //emit to only the user connected
    socket.emit('message',"welcome to the chat app!");

    socket.on('enter room',({name,room})=>{

    })
    //broadcast to all others connected not the user
    socket.broadcast.emit('message',`${socket.id} is connected`);
    //listening for a message event
    socket.on('message',({name,text})=>{
        
        io.emit('message',{name,
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

// function buildMsg(name,text){
//     return{
//         name,
//         text,
//         time:new Intl.DateTimeFormat('default',{
//             hour:'numeric',
//             minute:'numeric',
//             second:'numeric'
//         }).format(new Date())
//     }
// }