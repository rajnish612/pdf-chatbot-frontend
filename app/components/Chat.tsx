"use client";
import React, { useContext, useState } from "react";
import { FileSelectContext } from "../context/FileSelectContextWrapper";

const Chat = () => {
  const context = useContext(FileSelectContext);

  const [messages, setMessages] = useState<
    Array<{
      user: string | null;
      ai: string | null;
    }>
  >([]);
  const [query, setQuery] = useState<string | null>(null);
  const handleSend = async () => {
    if (!context) return;

    if (!query) return;
    setMessages([...messages, { user: query, ai: "" }]);
    try {
      context.setMessageLoading(true);
      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });
      const data = await res.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          ai: data.answer, // your backend returns "answer"
        };
        return updated;
      });
      setQuery("");
    } catch (err) {
      console.log("error", err);
    } finally {
      context.setMessageLoading(false);
    }
  };
  console.log("messageloading", context?.messageLoading);

  return (
    <div className="h-full w-full relative flex flex-col bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100">
      {context && context?.file?.name && (
        <div className="absolute top-2 sm:-top-10 right-2 sm:right-6 bg-green-100 border border-green-200 rounded-lg px-2 sm:px-4 py-1 sm:py-2 max-w-xs z-10">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 text-xs sm:text-sm font-medium truncate">
              File: {context?.file?.name}
            </span>
          </div>
        </div>
      )}
      <div className="flex-1 pt-10 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col gap-3 sm:gap-5 overflow-y-auto p-3 sm:p-6 lg:p-8">
          {messages.length !== 0 ? (
            messages.map((message, idx) => (
              <>
                <div
                  className="bg-slate-100 rounded-xl sm:rounded-2xl max-w-[85%] sm:max-w-[80%] lg:max-w-[calc(100%-200px)] ml-auto p-2 sm:p-3 shadow-lg"
                  key={idx}
                >
                  <p className="text-sm sm:text-base text-gray-800">
                    {message.user}
                  </p>
                </div>
                <div className="bg-sky-300 max-w-[85%] sm:max-w-[80%] lg:max-w-[calc(100%-200px)] mr-auto p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                  <p className="text-sm sm:text-base text-gray-800">
                    {message.ai}
                  </p>
                </div>
              </>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-full sm:max-w-2xl px-4">
                <h2 className="text-gray-800 text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
                  Welcome to PDF ChatBot
                </h2>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Upload a PDF from the panel and ask any question related to
                  the document. Get instant, intelligent responses powered by
                  AI.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto flex rounded-xl sm:rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
            <input
              value={query ? query : ""}
              onChange={(e) => setQuery(e.target.value)}
              readOnly={context && context?.file?.name ? false : true}
              className="flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-gray-800 placeholder-gray-500 bg-transparent outline-none text-sm sm:text-base lg:text-lg"
              type="text"
              placeholder={`${
                !context?.file && !context?.file?.name
                  ? "Please upload and choose a PDF first..."
                  : "Ask anything about your document..."
              }`}
            />
            <button
              className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSend}
              disabled={
                !context?.file?.name || !query || context.messageLoading
              }
            >
              <span className="flex items-center space-x-1 sm:space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span className="hidden sm:inline">Send</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
