"use client";
import React, { useState } from "react";
import Chat from "./components/Chat";
import Panel from "./components/Panel";

const Page = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      <div
        className={`${
          isPanelOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0  fixed lg:relative z-50 lg:z-auto transition-all   lg:transition-none`}
      >
        <Panel onClose={() => setIsPanelOpen(false)} />
      </div>

      <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 xl:p-5">
        <div className="flex flex-col">
          <button
            onClick={() => setIsPanelOpen(true)}
            className="lg:hidden  w-fit p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="pb-2 flex-shrink-0">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-md sm:text-3xl font-bold tracking-tight">
              PDF Chatbot
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg  font-medium">
              Upload a PDF and chat with your documents
            </p>
            <div className=" space-y-1">
              <p className="text-gray-500 text-xs sm:text-sm">
                <span className="font-semibold text-blue-600">
                  Generative Artificial Intelligence Project
                </span>{" "}
                •
              </p>
              <p className="text-blue-600 text-xs">
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
