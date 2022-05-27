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
        <img className="icon-menu" src="iconMenu.png"></img>
      </header>
    </div>
  )
}

export default FullChat