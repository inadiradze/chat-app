import React, { useEffect, useContext, useRef, useState } from "react";
import "./style.css";
import { Context } from "./Context";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({socket, name, camp}) {


	const [msgList, setMessageList] = useState([]);
	const [msg, setMsg] = useState("");

	async function sendMsg(evt){
	    	
	    if(msg !== "" && evt.key === 'Enter' && !evt.shiftKey){
	      evt.preventDefault();
	      console.log(name);
	      console.log(msg);
	      let dateTime = new Date();
	      var minutes = ("0" + dateTime.getMinutes()).substr(-2);

	      const msgData = {user: name, message: msg, camp: camp, time: dateTime.getHours() + ":" + minutes
	         }

	      await socket.emit("send_message", msgData);
	       setMessageList((list) => [...list, msgData]);
	      setMsg("");
    }
  };

	useEffect(() => {
    	socket.on("receive_message", (data) => {
      		setMessageList((list) => [...list, data]);
    });
    	return () => socket.off('receive_message');
  }, []);

	return( 
		<div className="chat-div">
			<div className="chat-window">
				<div className="chat-input">
					<textarea className="chat-textinput" placeholder="Say something..." value={msg} onChange={e => setMsg(e.target.value)} onKeyPress={sendMsg}> 
				  	</textarea>
				</div>
				<div className="chat-messages">
				<ScrollToBottom className="msg-container">
				{msgList.map((content, index) => {
            		return (
					<div id={name === content.user ? "you" : "other"}  key={index}className="chat-msg">
						<p id="author">{content.user} <span id="timeid">{content.time}</span></p>
						<p id="message">{content.message}</p>
					</div>
					)})}
					</ScrollToBottom>
				</div>
			</div>
		</div>
)}

export default Chat;