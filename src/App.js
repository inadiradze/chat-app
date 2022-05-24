import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./style.css";

const socket = io.connect("http://localhost:4000");

function App() {

  const [msg, setMsg] = useState("");
  const [recievedMsg, setRecievedMsg] = useState("");
  const [camp, setCamp] = useState("");
  const [name, setName] = useState("");
  const [sender, setSender] = useState("");
  const [chat, setChat] = useState([]);

  function sendMsg(){
      socket.emit("sendMsg-camp", { message: msg, camp, name});
    setMsg("");
  };

  function joinCamp(){
    if(camp !== "") {
      socket.emit("join-camp", camp);
    }
  };

  useEffect( () => {
    socket.on("recieve-msg", (data) => {
      setRecievedMsg(data.message);
      setSender(data.name);
      setChat(`${data.name}: ${data.message}`);
    });
  }, [socket]);

  return (
    <div className="app">
     <h3> Join a chat </h3>
     <input onChange={(e) => {setName(e.target.value)}} value={name} type="text" placeholder="What's your name?" />
     <input onKeyPress={ (e) => {e.key === 'Enter' && joinCamp()}} onChange={ (e) => {setCamp(e.target.value)}} value={camp} type="text" placeholder="Which camp you want to join?" />
     <input onKeyPress={ (e) => {e.key === 'Enter' && sendMsg()}} value={msg} onChange={ (e) => {setMsg(e.target.value)}}type="text" placeholder="Say something..." />
     <h1> Chat </h1>
     <p>{chat}</p>
    </div>
  )
}

export default App
