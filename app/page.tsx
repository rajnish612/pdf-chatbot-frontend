import React from "react";
import Chat from "./components/Chat";
import Panel from "./components/Panel";

const page = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Panel />
      <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 xl:p-12">
        <div className="mb-6 lg:mb-8 flex-shrink-0">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
            PDF Chatbot
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-2 font-medium">
            Upload a PDF and chat with your documents
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default page;
