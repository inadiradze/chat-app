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
      <header>
        <p className="camp-h">Karavi</p>
        <img className="icon-menu" src="menu.png"></img>
      </header>
      <div className="camp-div">
        <p className="nselector-h">What is your name?</p> 
        <br></br>
        <input className="name-selector" type="text"></input>
        <br></br>
        <p className="cselector-h">Join the camp</p>
        <input className="camp-selector" type="text"></input>
      </div>
    </div>
  )
}

export default FullChat