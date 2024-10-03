let username =document.querySelector(" #userinp");
let chatroom =document.querySelector(" #chatroom");
let joinBtn =document.querySelector(".btn");
let main = document.querySelector(".main");
let chat =document.querySelector(".chat-screen");
let sendBtn = document.querySelector(".bottom button");
let msgInp = document.querySelector(".bottom input");
let exitBtn =document.querySelector(".exit-btn");
let showChat =document.querySelector(".chat-hero");

//initializing websocket object
const socket = io('ws://localhost:8080');

 function sendMessage(e){
   e.preventDefault();
   if(msgInp.value!=""){
      socket.emit('message',//send the message to server
        {name: username.value,
         room:chatroom.value,
        text: msgInp.value
        }
      )
      //on message listens the server for messages 
 socket.on("message",({name,text,time})=>{
   
   const el=document.createElement("div");
   el.classList.add("you");
   const title = document.createElement("div");
   el.appendChild(title);
   title.className="title";
   const para = document.createElement("p");
   el.appendChild(para);
   title.innerHTML= `<span class="name">${name}</span> <span class="time">${time}</span>`;
   para.textContent= text;
   showChat.appendChild(el);
 }
 );
      msgInp.value = "";  
   }
   msgInp.focus();
 }

 //on clicking the send message call sendmessage function
 sendBtn.addEventListener("click",sendMessage);

 //when key is pressed then show this message
 msgInp.addEventListener("keypress",()=>{
   socket.emit('activity',`${username.value} is typing...`);
 })

 
 //listens the server for activity message
 socket.on('activity',(name)=>{
   const act = document.createElement("p");
   act.textContent=name;
   showChat.appendChild(act);
   activeTimer = setTimeout(()=>{
      act.textContent="";
   },3000);
      
 })
 socket.on('update-room',({room}) =>{
    let roomList =document.createElement("li");
    roomList.textContent=room;
    document.querySelector(".roomList").appendChild(roomList);
 })
 socket.on('connected',({name})=>{
    let msg = document.createElement("h3");
    msg.textContent=`${name} is connected`;
    showChat.appendChild(msg);
    
 })
//when join btn is clicked for joining the chatroom
joinBtn.addEventListener("click",(event)=>{
   event.preventDefault();
   if(username.value && chatroom.value){
 
      socket.emit('enter-room',{
      
         room:chatroom.value,
         name:username.value
      }
      )
    main.classList.add("disable");
    chat.classList.remove("disable");
   }          
}
 );             
//exit btn clicked
 exitBtn.addEventListener("click",()=>{
   chat.classList.add("disable");
   main.classList.remove("disable");
   document.location.reload();
});



 