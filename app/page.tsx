"use client";
import React from "react";
import Chat from "./components/Chat";

const Page = () => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 xl:p-5">
        <div className="flex flex-col">
          <div className="pb-2 flex-shrink-0">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-md sm:text-3xl font-bold tracking-tight">
              Generative Artificial Intelligence Project (PDF Chatbot)
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg  font-medium">
              Upload a PDF using the document icon and chat with your documents
            </p>
            <div className=" space-y-1">
              
              <p className="text-blue-600 text-md lg:text-lg">
                <span className="font-medium">Author:</span> Rajnish Nath •
                <span className="font-medium">Education:</span> BCA
                Undergraduate, Manipal University Jaipur
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Page;
