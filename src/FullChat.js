import React, { useEffect, useContext, useState } from "react";
import io from "socket.io-client";
import "./style.css";
import Chat from "./Chat";
import { Context } from "./Context";

const socket = io.connect("http://localhost:4000");

function FullChat(){
  const [campSet, setCampSet] = useState("");
  const [camp, setCamp] = useState("");
  const [nameSet, setNameSet] = useState("");
  const [name, setName] = useState("");
  const {setShowChat} = useContext(Context);
 

  function joinCamp(evt){
    if(evt.key === 'Enter' && camp !== "" && name!== "") {
      socket.emit("join-camp", camp, name);
      setNameSet(name);
      setCampSet(camp);
      setCamp(""); setName("");
      setShowChat(true);
    }
  };


  return (

    <div className="camp-selector">
      <div className="camp-div">
        <p className="nselector-h">What is your name?</p> 
        <br></br>
        <input onChange={ e => setName(e.target.value)} value={name}className="name-selector" type="text"></input>
        <br></br>
        <p className="cselector-h">Join the camp</p>
        <input onKeyPress={joinCamp} onChange={ e => setCamp(e.target.value)} value={camp} className="camp-selector" type="text"></input>
      </div>
    </div>
  )
}

export default FullChat