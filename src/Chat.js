import React, { useEffect, useContext, useRef, useState } from "react";
import "./style.css";
import { Context } from "./Context";

function Chat({socket, name, camp}) {


	const [msgList, setMessageList] = useState([]);
	const [msg, setMsg] = useState("");

	async function sendMsg(){
	    	
	    if(msg !== ""){

	      let dateTime = new Date();
	      var minutes = ("0" + dateTime.getMinutes()).substr(-2);

	      const msgData = {name: name, message: msg, camp: camp, time: dateTime.getHours() + ":" + minutes
	         }

	      await socket.emit("send_message", msgData);
	       setMessageList((list) => [...list, msgData]);
	      setMsg("");
    }
  };

	// useEffect(() => {
 //    	socket.on("receive_message", (data) => {
 //      		setMessageList((list) => [...list, data]);
 //    });
 //    	return () => socket.off('receive_message');
 //  }, []);

	return( 
		<div className="chat-div">
			<div className="chat-window">
				<div className="chat-input">
				<input className="chat-textinput" type="text" placeholder="Say something..." />
				</div>
			</div>
		</div>
)}

export default Chat;