import React, {useContext, useEffect, useState} from 'react';
import {Context} from './App';

function Menu(){

	const {leave, setLeave} = useContext(Context);
	const {joined, setJoined} = useContext(Context);
	const {menu, setMenu} = useContext(Context);


	return(
		<div className="menu-window">
			
			<div className="menu-div">
				
				
				<div className="userlist">
				<span className="user-h">Members</span>
				
				{joined.map((content, index) => {

                return (

                	<div key={index} className="user-div">

                		<p id={localStorage.getItem("name") === content.user ? "user-you" : "user-other"}>{content.user}</p>
            		</div>
            	)})}
				</div>
				<div className="menu-options">
					<a href="/">
						<p onClick={()=> setLeave(true)}className="menu-leave"> Leave camp </p>
					</a>
				</div>
			</div>
		</div>
)};




export default Menu;