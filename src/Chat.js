import React, { useEffect, useContext, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import ScrollToBottom from "react-scroll-to-bottom";
import {Context} from "./App";
import Menu from "./Menu";
import Img from "./Img";
import axios from 'axios';
import sound from './assets/pop.mp3';
import { Loader } from '@mantine/core';
const audio = new Audio(sound);
var moment = require('moment-timezone');


function Chat({ socket, name, camp }) {

  const [msgList, setMessageList] = useState([]);
  const [msg, setMsg] = useState("");
  const {menu} = useContext(Context);
  const fileInput = useRef();
  const [file, setFile] = useState();
  const {typing, setTyping} = useContext(Context);
  const {joined, setJoined} = useContext(Context);
  const {onlineUsers, setOnlineUsers} = useContext(Context);
  const [loading, setLoading] = useState(true);
  
  
  async function sendMsg(evt) {
    if (evt.key == "Enter") {
      let dateTime = moment().tz("Asia/Tbilisi").format("HH:mm");
      
      evt.preventDefault();
      

      if(msg === "/img"){
        setMsg("");
        
      }
      if(msg === "/soundoff"){
        
        setMsg("");
        localStorage.setItem("sound-off", "yes");
        const msgData = {
          user: `Sound is off`,
          time: dateTime,
        };

        setMessageList((list) => [...list, msgData]);
      }
      if(msg === "/soundon"){
        
        setMsg("");
        localStorage.removeItem("sound-off");
        const msgData = {
          user: `Sound is on`,
          time: dateTime,
        };

        setMessageList((list) => [...list, msgData]);
      }
      if(file) {
        if(localStorage.getItem("sound-off") === null){
          audio.play();
        }
        const msgData = {
          user: name,
          message: file,
          camp: camp,
          time: dateTime,
          img: "yes",
          type: file.type,
          name: file.name,
        };

        await socket.emit("send_message", msgData);
        
        setMessageList((list) => [...list, msgData]);
        setMsg("");
        setFile();

      }

      if (msg != "" && msg !== "/soundon" && msg !== "/soundoff" && msg !== "/img" && !file) {
        if(localStorage.getItem("sound-off") === null){
          audio.play();
        }

        let dateTime = moment().tz("Asia/Tbilisi").format("HH:mm");

        const msgData = {
          user: name,
          message: msg,
          camp: camp,
          time: dateTime,
        };

        await socket.emit("send_message", msgData);
        
        setMessageList((list) => [...list, msgData]);
        setMsg("");
      }
      setTyping(false);
      const data = {camp: camp, name: name};
      socket.emit("typing-over", data);
    }
  }

  function selectFile(e) {
    setMsg(e.target.files[0].name);
    setFile(e.target.files[0]);
  }

  function renderImage(image) {

    const blob = new Blob([image.message], {type: image.type});

      return(

      <Img fileName={image.fileName} blob={blob} />
      )
  }

  function showTyping(value){
    setTyping(true);
    if(value.length == 0){
      setTyping(false);
      const localCamp = localStorage.getItem("camp");
      const localName = localStorage.getItem("name");
      const data = {camp: localCamp, name: localName};
      socket.emit("typing-over", data);
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      if(data.typing !== "yes" &&localStorage.getItem("sound-off") === null){
        audio.play();
      }
    
    });

    socket.on("users", (data) => {
      setJoined(data);
    });

    socket.on("online-users", (data) => {
      setOnlineUsers(data);
    });

    socket.on("saved-messages", (data) => {
      setLoading(false);  
      setMessageList(data);
        
    });

    return () => {socket.off("receive_message"); socket.off("leave-camp"); socket.off("join-oldcamp"); socket.off("typing"); setTyping(false); socket.off("saved-messages"); socket.off("name-taken"); socket.off("users");
    };
  }, []);

  useEffect (()=> {
    socket.on("removeTyping", (data) => {
      let typingUser = document.querySelectorAll(".typing-author");
      let user = data.name;

      for(let i=0; i<typingUser.length; i++) {

        if(typingUser[i].textContent === user){
          typingUser[i].parentElement.parentElement.style.display="none";
          }                
      }

    });
    return ()=> {socket.off("typing-over")}; 
  }, []);

  useEffect ( ()=> {
    
      let typing = document.querySelectorAll(".typing-msg");

      for(let i=0; i<typing.length; i++) {
        typing[i].style.display="none";
      }
    
  }, [menu]);

  




  return (
    <div>
    {!menu ? (
      <div className="chat-div">
        <div className="chat-window">
        {loading && <Loader color="white" className="loader"/>}

          <p className="camp-name">{camp}</p>
          <div className="empty-div"></div>
       
          <div className="chat-input">
            <input
              type="text"
              className="chat-textinput"
              placeholder="Say something..."
              value={msg}
              onChange={(e) => {setMsg(e.target.value); showTyping(e.target.value)}}
              onKeyPress={sendMsg}
            ></input>
          
              <input onChange={selectFile}ref={fileInput} type="file" className="file-input" accept="image/*"></input>
            
          </div>
          

          <div className="chat-messages">

            <ScrollToBottom className="msg-container">

              {msgList.map((content, index) => {
                return (

                  <div
                    id={name === content.user ? ("you") : ("other")}
                    key={index}
                    className={content.typing === 'yes' ? ("typing-msg chat-msg") : ("chat-msg")}
                  >
                    <p className={content.type != null ? "info-msg" : "full-msg"}>
                      <span className={content.typing === 'yes' ? ("typing-author") : ("author")} id="author">
                        {content.user}
                      </span>
                      {content.type != null && <span id="connection-info"> {content.info} </span>}
                      <span id="timeid">{content.time}</span>
                      <span id="message">{content.img === 'yes' ? (renderImage(content)) : (content.message)}</span>
                    </p>
                  </div>
                );
              })}
              
            </ScrollToBottom>
          </div>
        </div>
      </div>) : (<Menu />)}
    <div className="empty-footer"></div>
    </div>

  );
}

export default Chat;
