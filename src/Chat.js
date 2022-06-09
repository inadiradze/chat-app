import React, { useEffect, useContext, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import ScrollToBottom from "react-scroll-to-bottom";
import {Context} from "./App";
import Menu from "./Menu";
import Img from "./Img";
import axios from 'axios';

function Chat({ socket, name, camp }) {
  const [msgList, setMessageList] = useState([]);
  const [msg, setMsg] = useState("");
  const {menu} = useContext(Context);
  const {joined, setJoined} = useContext(Context);
  const fileInput = useRef();
  const [file, setFile] = useState();
  const {typing, setTyping} = useContext(Context);
  
  async function sendMsg(evt) {
    if (evt.key == "Enter") {
      evt.preventDefault();
      let dateTime = new Date();
      var minutes = ("0" + dateTime.getMinutes()).substr(-2);

      if(msg === "/img"){
        setMsg("");
        fileInput.current.click();
      }
      if(file) {
        const msgData = {
          user: name,
          message: file,
          camp: camp,
          time: dateTime.getHours() + ":" + minutes,
          img: "yes",
          type: file.type,
          name: file.name,
        };

        await socket.emit("send_message", msgData);
        setTyping(false);
        socket.emit("typing-over", camp);
        setMessageList((list) => [...list, msgData]);
        setMsg("");
        setFile();
        // const formData = new FormData();
        // formData.append('file', file);
        
        //   const res = await axios.post('http://localhost:4000/upload/', formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }
        // });


      }

      if (msg != "" && msg !== "/img" && !file) {

        const msgData = {
          user: name,
          message: msg,
          camp: camp,
          time: dateTime.getHours() + ":" + minutes,
        };

        await socket.emit("send_message", msgData);
        setTyping(false);
        socket.emit("typing-over", camp);
        setMessageList((list) => [...list, msgData]);
        setMsg("");
      }
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
      socket.emit("typing-over", localCamp);
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    return () => {socket.off("receive_message"); socket.off("leave-camp"); socket.off("join-oldcamp"); socket.off("typing"); setTyping(false);
    };
  }, []);

  useEffect (()=> {
    socket.on("removeTyping", (data) => {
      let typingDiv = document.querySelectorAll(".typing-msg");

      for(let i=0; i<typingDiv.length; i++) {
        typingDiv[i].style.display="none";
      }

    });
    return ()=> {socket.off("typing-over")}; 
  }, []);

 
  return (
    <div>
    {!menu ? (
      <div className="chat-div">
        <div className="chat-window">
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
                    id={name === content.user ? "you" : "other"}
                    key={index}
                    className={content.typing === 'yes' ? ("typing-msg chat-msg") : ("chat-msg")}
                  >
                    <p className={content.type != null ? "info-msg" : "full-msg"}>
                      <span id="author">
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
