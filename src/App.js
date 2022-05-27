import React, { useState } from "react";
import FullChat from "./FullChat";
import { Context } from "./Context";
import Chat from "./Chat";
import Header from "./Header";

function App() {

  return (
    <div className="bg-app">
      <div className="app blur">
        <Header />
      <main>
        <FullChat />
      </main>
      </div>
    </div>
)};

export default App
