"use client";
import React, { useContext, useEffect, useState } from "react";
import { FileSelectContext } from "../context/FileSelectContextWrapper";

const Chat = () => {
  const context = useContext(FileSelectContext);
  const [query, setQuery] = useState<string | null>(null);
  const handleSend = async () => {
    if (!query) return;
    try {
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
      console.log(data);
    } catch (err) {
      console.log("error", err);
    }
  };
  return (
    <div className="h-full w-full border-t-2 b border-l-sky-500 flex flex-col ">
      <div className="flex flex-col flex-1 relative justify-center items-center">
        <h1 className="text-black text-2xl">Welcome to PDF ChatBot</h1>
        {context && context?.file?.name && (
          <span className="absolute top-0 right-2 line-clamp-1 text-black">
            {" "}
            File selected: {context?.file?.name}
          </span>
        )}
        <span>
          upload a pdf from the panel and ask any question related to the pdf{" "}
        </span>
      </div>
      <div className="h-20 rounded-full flex p-2 mx-auto w-[calc(100%-200px)] bg-slate-200 text-black">
        <input
          onChange={(e) => setQuery(e.target.value)}
          readOnly={context && context?.file?.name ? false : true}
          className="flex-1 bg-amber-200 flex h-full outline-0"
          type="text"
          placeholder={`${
            !context?.file && !context?.file?.name
              ? "Please upload and choose a pdf "
              : "Ask anything"
          } `}
        />
        <button
          className="w-[calc(100%-80%)] bg-blue-200 p-2"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
