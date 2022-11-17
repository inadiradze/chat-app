import React, { useEffect, useContext, useState } from "react";
import io from "socket.io-client";
import "./style.css";
import Chat from "./Chat";
import {Context} from "./App";

const server = 'https://al-karav-production.up.railway.up';

const socket = io.connect(server);

function Home(){
  const [campSet, setCampSet] = useState("");
  const [camp, setCamp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const {showChat, setShowChat} = useContext(Context);
  const {leave, setLeave} = useContext(Context);
  const {menu, setMenu} = useContext(Context);
  const {typing, setTyping} = useContext(Context);
  var moment = require('moment-timezone');


  function messageData(username, info, message, campname, name, typing) {

    let dateTime = moment().tz("Asia/Tbilisi").format("HH:mm");
  
    const msgData = {
              user: username,
              info: info, 
              message: message,
              camp: campname,
              name: name,
              time: dateTime,
              type: 'info',
              typing: typing,
        };
    return msgData;
  }



  function checkForSession(){
    if(localStorage.getItem("camp") !== null && localStorage.getItem("name") !== null){
      const localCamp = localStorage.getItem("camp");
      const localName = localStorage.getItem("name");
      const joinText = ` has connected`;
      setShowChat(true);
      socket.emit("join-oldcamp", localCamp, localName, messageData(localName, joinText, null, localCamp, localName));
    }
  }

  function joinCamp(evt){
    if(evt.key === 'Enter' && camp !== "" && name!== "") {
      if(camp.length > 10 || name.length > 10){
        setError("Camp or user names must not be more than 10 characters...");
      }else{
        const joinText = ` has joined the camp`;

        localStorage.setItem("camp", camp);
        localStorage.setItem("name", name);
        socket.emit("join-camp", camp, name, messageData(name, joinText, null, camp));
        setCamp(""); setName("");
        setShowChat(true);
        socket.on("name-taken", ()=> {
          setShowChat(false);
          setError("User already exists in that camp...");
          localStorage.removeItem("camp");
          localStorage.removeItem("name");
          socket.emit("join-camp", "ERROR3333ERROR", "UNKNOWN");
        });
      }
    }
  };

  function leaveCamp(campName, userName){
    const leaveText = ` has left the camp`;
    socket.emit("leave-camp", messageData(userName, leaveText, null, campName, userName));
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
    if(typing){
      const localCamp = localStorage.getItem("camp");
      const localName = localStorage.getItem("name");

      socket.emit("typing", messageData(localName, ' is typing ...', null, localCamp, localName, 'yes'));
    }
  }, [typing]);

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

export default Home;
