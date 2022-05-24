import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./style.css";
import Chat from "./Chat";

const socket = io.connect("http://localhost:4000");


function App() {

  const [camp, setCamp] = useState("");
  const [name, setName] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [msgList, setMsgList] = useState([]);

  function joinCamp(){
    if(camp !== "" && name!== "") {
      socket.emit("join-camp", camp, name);
    }
  };


  return (

    <div className="app">
      <h3> Join a chat </h3>
      <input onChange={(e) => {setName(e.target.value)}} value={name} type="text" placeholder="What's your name?" />
      <input onKeyPress={ (e) => {e.key === 'Enter' && joinCamp()}} onChange={ (e) => {setCamp(e.target.value)}} value={camp} type="text" placeholder="Which camp you want to join?" />
      <h1> Chat </h1>
      <Chat camp={camp} socket={socket} name={name} />
     </div>
  )
}

export default App
