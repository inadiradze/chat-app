import React, {useContext} from 'react';
import {Context} from './App';

function Menu(){

	const {leave, setLeave} = useContext(Context);
	const {joined, setJoined} = useContext(Context);

	return(
		<div className="menu-window">
			<div className="menu-div">
				
				<div className="userlist">
				<span className="menu-h"> Menu </span>
				</div>
				<div className="menu-options">
					<p onClick={()=> setLeave(true)}className="menu-leave"> Leave camp </p>
				</div>
			</div>
		</div>
)};




export default Menu;