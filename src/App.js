import React, { useEffect, useState, useRef, createContext } from "react";
import Chat from "./Chat";
import Header from "./Header";
import Home from "./Home";

export const Context = createContext();


function App() {

  document.title = "Karavi | Home";

  const [showChat, setShowChat] = useState (false);
  const [menu, setMenu] = useState(false);
  const [leave, setLeave] =  useState(false);
  const [typing, setTyping] = useState(false);
  const [joined, setJoined] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [theme, setTheme] = useState();
  const themeBg = useRef();

  useEffect( () => {
    
      
    
  }, [theme]);

  return (
    <Context.Provider value={{showChat, setShowChat, menu, setMenu, leave, setLeave, typing, setTyping, joined, setJoined, onlineUsers, setOnlineUsers, theme, setTheme}}>
    <div ref={themeBg} className="bg-app">
      <div className="app">
        <Header />
        <main>
          <Home />
        </main>
      </div>
    </div>
    </Context.Provider>
  );
}

export default App;
