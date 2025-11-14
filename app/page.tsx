import React from "react";
import Chat from "./components/Chat";
import Panel from "./components/Panel";

const page = () => {
  return (
    <div className="flex h-screen">
      <Panel />
      <div className="h-screen flex flex-col w-full p-10 ">
        <h1 className="text-black text-5xl">PDF Chatbot</h1>
        <Chat />
      </div>
    </div>
  );
};

export default page;
