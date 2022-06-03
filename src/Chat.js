import React, { useEffect, useContext, useRef, useState } from "react";
import "./style.css";
import ScrollToBottom from "react-scroll-to-bottom";
import {Context} from "./App";
import Menu from "./Menu";

function Chat({ socket, name, camp }) {
  const [msgList, setMessageList] = useState([]);
  const [msg, setMsg] = useState("");
  const {menu} = useContext(Context);
  const {joined, setJoined} = useContext(Context);
  
  async function sendMsg(evt) {
    if (evt.key == "Enter") {
      evt.preventDefault();
      if (msg != "") {
        let dateTime = new Date();
        var minutes = ("0" + dateTime.getMinutes()).substr(-2);

        const msgData = {
          user: name,
          message: msg,
          camp: camp,
          time: dateTime.getHours() + ":" + minutes,
        };

        await socket.emit("send_message", msgData);
        setMessageList((list) => [...list, msgData]);
        setMsg("");
      }
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("joined-list", (data) => {
      setJoined((list) => [...list, data]);
    })

    return () => {socket.off("receive_message"); socket.off("leave-camp"); socket.off("join-oldcamp"); socket.off("joined-list");
    };
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
              onChange={(e) => setMsg(e.target.value)}
              onKeyPress={sendMsg}
            ></input>
          </div>

          <div className="chat-messages">

            <ScrollToBottom className="msg-container">

              {msgList.map((content, index) => {
                return (
                  <div
                    id={name === content.user ? "you" : "other"}
                    key={index}
                    className="chat-msg"
                  >
                    <p className={content.type != null ? "info-msg" : "full-msg"}>
                      <span id="author">
                        {content.user}
                      </span>
                      {content.type != null && <span id="connection-info"> {content.info} </span>}
                      <span id="timeid">{content.time}</span>
                      <span id="message">{content.message}</span>
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
