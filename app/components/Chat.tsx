"use client";
import React, { useContext, useState } from "react";
import { FileSelectContext } from "../context/FileSelectContextWrapper";

const Chat = () => {
  const context = useContext(FileSelectContext);

  const [messages, setMessages] = useState<
    Array<{
      user: string | null;
      ai: string | null;
      error?: boolean;
    }>
  >([]);
  const [query, setQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000); 
  };

  const handleSend = async () => {
    if (!context) {
      showError("Context not available. Please refresh the page.");
      return;
    }

    if (!query?.trim()) {
      showError("Please enter a question.");
      return;
    }

    if (!context.file) {
      showError("Please upload and select a PDF file first.");
      return;
    }

    const currentQuery = query.trim();
    setQuery("");
    setError(null);
    setMessages([...messages, { user: currentQuery, ai: "" }]);
    
    try {
      context.setMessageLoading(true);
      
      if (!process.env.NEXT_PUBLIC_SERVER_URL) {
        throw new Error("Server URL not configured. Please check your environment variables.");
      }

      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: currentQuery,
        }),
        signal: AbortSignal.timeout(30000), 
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Server error: ${res.status} ${res.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      
      if (!data.answer) {
        throw new Error("No response received from the AI. Please try again.");
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          ai: data.answer,
        };
        return updated;
      });
    } catch (err) {
      console.error("Chat error:", err);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (err instanceof Error) {
        if (err.name === 'TimeoutError') {
          errorMessage = "Request timed out. The server might be busy. Please try again.";
        } else if (err.message.includes('fetch')) {
          errorMessage = "Unable to connect to the server. Please check your internet connection.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          ai: "Sorry, I encountered an error processing your request. Please try asking again.",
          error: true,
        };
        return updated;
      });
      
      showError(errorMessage);
    } finally {
      context.setMessageLoading(false);
    }
  };
 

  return (
    <div className="h-full w-full relative flex flex-col bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-2 hover:bg-red-600 rounded p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      {context && context?.file?.name && (
        <div className="absolute top-2  right-2  bg-green-100 border border-green-200 rounded-lg px-2 sm:px-4 py-1 sm:py-2 max-w-xs z-10">
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl max-w-[85%] sm:max-w-[80%] lg:max-w-[calc(100%-200px)] ml-auto p-2 sm:p-3 shadow-lg"
                  key={idx}
                >
                  <p className="text-sm sm:text-base text-white font-medium">
                    {message.user}
                  </p>
                </div>
                <div className={`${message.error ? 'bg-red-100 border-red-300' : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'} max-w-[85%] sm:max-w-[80%] lg:max-w-[calc(100%-200px)] mr-auto p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg border`}>
                  <div className="flex items-start space-x-2">
                    <div className={`flex-shrink-0 w-6 h-6 ${message.error ? 'bg-red-500' : 'bg-blue-500'} rounded-full flex items-center justify-center mt-0.5`}>
                      {message.error ? (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm sm:text-base ${message.error ? 'text-red-800' : 'text-gray-800'} font-medium leading-relaxed`}>
                        {message.ai || (
                          <span className="flex items-center space-x-2 text-gray-500">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-xs">Thinking...</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
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
