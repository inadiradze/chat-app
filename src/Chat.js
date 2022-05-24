import React, { useEffect, useState } from "react";
import "./style.css";



function Chat({socket, name, camp}) {

	const [msgList, setMessageList] = useState([]);
	const [msg, setMsg] = useState("");
	const [chatList, setChatlist] = useState([]);

	async function sendMsg(){
	    if(msg !== ""){

	      let dateTime = new Date();
	      var minutes = ("0" + dateTime.getMinutes()).substr(-2);

	      const msgData = {message: msg, camp: camp, name: name, time: dateTime.getHours() + ":" + minutes
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
  }, [socket]);

	return( 

		<div className="chat-window">
		<input onKeyPress={ (e) => {e.key === 'Enter' && sendMsg()}} value={msg} onChange={ (e) => {setMsg(e.target.value)}}type="text" placeholder="Say something..." />
	       {msgList.map((chatlist) => {
	          return (
	          <div id={name === chatlist.name ? "you" : "other"}>
	           <p>[{chatlist.time}] {chatlist.name}: {chatlist.message} </p>
	          </div>)})}
	     </div>)
}

export default Chat;