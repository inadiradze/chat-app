import React, {useContext} from "react";
import Home from './Home';
import {Context} from './App';
import Menu from './Menu';

function Header() {
	const {menu, setMenu} = useContext(Context);

	return (
		<div>
			<header>
				<a href="/">
		    		<p className="camp-h">Karavi</p>
		    	</a>
		    	<img onClick={ ()=> {setMenu(!menu)}} className="icon-menu" src="menu.png"></img>
		    	<div className="empty-header"></div>
	      	</header>
      	</div>

  )};

export default Header;