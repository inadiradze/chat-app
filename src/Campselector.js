import React from 'react';

function Campselector(){
  return(
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
)}

export default Campselector