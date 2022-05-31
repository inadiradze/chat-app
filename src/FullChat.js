import React, { useEffect, useContext, useState } from "react";
import io from "socket.io-client";
import "./style.css";
import Chat from "./Chat";
import {Context} from "./App";

// const server = 'https://dangerous-honey-production.up.railway.app';

const socket = io.connect('192.168.0.102:4000');

function FullChat(){
  const [campSet, setCampSet] = useState("");
  const [camp, setCamp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const {showChat, setShowChat} = useContext(Context);


  function checkForSession(){
    if(localStorage.getItem("camp") !== null && localStorage.getItem("name") !== null){
      const localCamp = localStorage.getItem("camp");
      const localName = localStorage.getItem("name"); 
      setShowChat(true);
      socket.emit("join-oldcamp", localCamp, localName);
    }
  }

  useEffect ( () => {
    checkForSession();
  }, []);

  function joinCamp(evt){
    if(evt.key === 'Enter' && camp !== "" && name!== "") {
      if(camp.length > 10 || name.length > 10){
        setError("Camp or user names must not be more than 10 characters...");
      }else{
        localStorage.setItem("camp", camp);
        localStorage.setItem("name", name);
        socket.emit("join-camp", camp, name);
        setCamp(""); setName("");
        setShowChat(true);
      }
    }
  };

    return(
      <div className="home-div">
        {showChat ? ( <Chat socket={socket} name={localStorage.getItem("name")} camp={localStorage.getItem("camp")} />) : (

        <div className="camp-selector">
          <div className="camp-div">
            <p className="nselector-h">What is your name?</p> 

            <input onChange={ e => setName(e.target.value)} value={name}className="name-selector" type="text"></input>
            <br></br>
            <p className="cselector-h">Join the camp</p>
            <input onKeyPress={joinCamp} onChange={ e => setCamp(e.target.value)} value={camp} className="camp-selector" type="text"></input>
            {error != "" && (
            <div className="error-div">
              <p> {error} </p>
            </div>)}
          </div>
        </div>)}
      </div>
  )};

export default FullChat