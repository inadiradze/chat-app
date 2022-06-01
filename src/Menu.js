import React, {useContext} from 'react';
import {Context} from './App';

function Menu(){

	const {leave, setLeave} = useContext(Context);

	return(
		<div className="menu-window">
			<div className="menu-div">
				<p className="menu-h"> Menu </p>
				<div className="menu-options">
					<p onClick={()=> setLeave(true)}className="menu-leave"> Leave camp </p>
				</div>
			</div>
		</div>
)};




export default Menu;