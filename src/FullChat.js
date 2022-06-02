import React, { useEffect, useContext, useState } from "react";
import io from "socket.io-client";
import "./style.css";
import Chat from "./Chat";
import {Context} from "./App";

// const server = 'https://dangerous-honey-production.up.railway.app';

const socket = io.connect(server);

function FullChat(){
  const [campSet, setCampSet] = useState("");
  const [camp, setCamp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const {showChat, setShowChat} = useContext(Context);
  const {leave, setLeave} = useContext(Context);
  const {menu, setMenu} = useContext(Context);



  function checkForSession(){
    if(localStorage.getItem("camp") !== null && localStorage.getItem("name") !== null){
      const localCamp = localStorage.getItem("camp");
      const localName = localStorage.getItem("name");
      
      setShowChat(true);
      socket.emit("join-oldcamp", localCamp, localName);
    }
  }

  function joinCamp(evt){
    if(evt.key === 'Enter' && camp !== "" && name!== "") {
      if(camp.length > 10 || name.length > 10){
        setError("Camp or user names must not be more than 10 characters...");
      }else{
        let dateTime = new Date();
        var minutes = ("0" + dateTime.getMinutes()).substr(-2);
        const joinData = {
              user: name + '  has joined the camp',
              message: null,
              camp: camp,
              time: dateTime.getHours() + ":" + minutes,
        };

        localStorage.setItem("camp", camp);
        localStorage.setItem("name", name);
        socket.emit("join-camp", camp, name, joinData);
        setCamp(""); setName("");
        setShowChat(true);
      }
    }
  };

  function leaveCamp(campName, userName){
    let dateTime = new Date();
        var minutes = ("0" + dateTime.getMinutes()).substr(-2);
    const leaveData = {
          user: userName + '  has left the camp',
          message: null,
          camp: campName,
          time: dateTime.getHours() + ":" + minutes,
    };

    socket.emit("leave-camp", leaveData);
    setLeave(false);
    localStorage.removeItem("camp");
    localStorage.removeItem("name");
    setShowChat(false);
    setMenu(false);
  };

  useEffect ( () => {
    checkForSession();
  }, []);

  useEffect ( () => {
    const localCamp = localStorage.getItem("camp");
    const localName = localStorage.getItem("name"); 
    if(leave){
      leaveCamp(localCamp, localName);
    }
  }, [leave]);

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
        <div className="empty-footer"></div>
      </div>

  )};

export default FullChat
