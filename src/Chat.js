import React, { useEffect, useContext, useRef, useState } from "react";
import "./style.css";
import ScrollToBottom from "react-scroll-to-bottom";
import {Context} from "./App";
import Menu from "./Menu";

function Chat({ socket, name, camp }) {
  const [msgList, setMessageList] = useState([]);
  const [msg, setMsg] = useState("");
  const {menu} = useContext(Context);

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
      console.log(menu);
    });
    return () => {socket.off("receive_message")
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
                    <p className="full-msg">
                      <span id="author">
                        {content.user}
                        <span id="timeid">{content.time}</span>
                      </span>
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
