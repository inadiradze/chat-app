import React, { useState } from "react";
import FullChat from "./FullChat";
import { Context } from "./Context";
import Chat from "./Chat";
import Header from "./Header";

function App() {

  const [showChat, setShowChat] = useState(false);

  return (
    <div className="bg-app">
      <div className="app blur">
      <Header />
      <main>
      <Context.Provider value={{showChat, setShowChat}}>
      <Chat />
      </Context.Provider>
      </main>
      </div>
    </div>
)};

export default App
