import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./style.css";
import Chat from "./Chat";

const socket = io.connect("http://localhost:4000");

function FullChat(){

  const [camp, setCamp] = useState("");
  const [name, setName] = useState("");
  const [showChat, setShowChat] = useState(false);
 

  function joinCamp(){
    if(camp !== "" && name!== "") {
      socket.emit("join-camp", camp, name);
      setShowChat(true);
    }
  };


  return (

    <div className="camp-selector">
      <h3> Join a chat </h3>
      <input onChange={(e) => {setName(e.target.value)}} value={name} type="text" placeholder="What's your name?" />
      <input onKeyPress={ (e) => {e.key === 'Enter' && joinCamp()}} onChange={ (e) => {setCamp(e.target.value)}} value={camp} type="text" placeholder="Which camp you want to join?" />
      {showChat && (
      <Chat camp={camp} socket={socket} name={name} /> )}
     </div>
  )
}

export default FullChat