import React, { useState, createContext } from "react";
import FullChat from "./FullChat";
import Chat from "./Chat";
import Header from "./Header";
import Home from "./Home";
export const Context = createContext();

function App() {

  const [showChat, setShowChat] = useState (false);
  const [menu, setMenu] = useState(false);
  const [leave, setLeave] =  useState(false);

  return (
    <Context.Provider value={{showChat, setShowChat, menu, setMenu, leave, setLeave}}>
    <div className="bg-app">
      <div className="app blur">
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
