
let username =document.querySelector(" #userinp");
let chatroom =document.querySelector(" #chatroom");
let joinBtn =document.querySelector(".btn");
let main = document.querySelector(".main");
let chat =document.querySelector(".chat-screen");
let sendBtn = document.querySelector(".bottom button");
let msgInp = document.querySelector(".bottom input");// input of sending msg
let exitBtn =document.querySelector(".exit-btn");
let showChat =document.querySelector(".chat-hero");

// const socket = new WebSocket('ws://localhost:8080');//initializing websocket object
const socket = io('ws://localhost:8080');

 function sendMessage(e){
   e.preventDefault();
   if(msgInp.value!=""){
      socket.emit('message',{//send the message to server
         name:username.value,
         text:msgInp.value});
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

 //on message listens the server for messages
 socket.on("message",(data)=>{
   
   const el=document.createElement("div");
   el.classList.add("you");
   const title = document.createElement("div");
   el.appendChild(title);
   title.className="title";
   const para = document.createElement("p");
   el.appendChild(para);
   title.innerHTML= `<span class="name">${data.name}</span> <span class="time">${data.time}</span>`;
   para.textContent= data.text;
  showChat.appendChild(el);
 }
 )
 
 //listens the server for activity message
 socket.on('activity',(name)=>{
   const act= document.createElement("p");
   act.textContent=name;
   showChat.appendChild(act);
   
   activeTimer = setTimeout(()=>{
      act.textContent="";
   },3000);
      
 })


//when join btn is clicked for joining the chatroom
joinBtn.addEventListener("click",(event)=>{
   event.preventDefault();
   if(username.value && chatroom.value){
      socket.emit('enter room',{
         name:username.value,
         room:chatroom.value
      })
    main.classList.add("disable");
    chat.classList.remove("disable");
   }
            
}
 );             
//exit btn clicked
 exitBtn.addEventListener("click",()=>{
   chat.classList.add("disable");
   main.classList.remove("disable");
   
});



 