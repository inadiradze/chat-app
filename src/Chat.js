import React, { useEffect, useRef, useState } from "react";
import "./style.css";

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

	useEffect(() => {
    	socket.on("receive_message", (data) => {
      		setMessageList((list) => [...list, data]);
    });
    	return () => socket.off('receive_message');
  }, []);

	return( 

		<div className="chat-window">
			<h1> Chat </h1>
			<input onKeyPress={ (e) => {e.key === 'Enter' && sendMsg()}} value={msg} onChange={ (e) => {setMsg(e.target.value)}}type="text" placeholder="Say something..." />

	       {msgList.map((chatlist, index) => {
	          return (
	          <div key={index} id={name === chatlist.name ? "you" : "other"}>
	           <p>[{chatlist.time}] {chatlist.name}: {chatlist.message} </p>
	          </div>)})}
	     </div>)
}

export default Chat;