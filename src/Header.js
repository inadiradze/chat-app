import React, {useContext} from "react";
import Home from './Home';
import {Context} from './App';

function Header() {
	const {menu, setMenu} = useContext(Context);

	function toggleMenu() {
		if(menu){
			setMenu(false);
		}else{
			setMenu(true);
		}
	}

	return (
		<header>
			<a href="/">
	    		<p className="camp-h">Karavi</p>
	    	</a>
	    	<img onClick={ ()=> {toggleMenu()}} className="icon-menu" src="menu.png"></img>
      	</header>

  )};

export default Header;