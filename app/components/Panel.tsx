"use client";
import React, { useContext, useState } from "react";
import { FileSelectContext } from "../context/FileSelectContextWrapper";

const Panel = () => {
  const context = useContext(FileSelectContext);

  const [files, setFiles] = useState<Array<File>>([]);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].type == "application/pdf")
      setFiles([...files, e.target.files[0]]);
  };

  const handleSelectFile = async (idx: number) => {
    if (!context) return;
    const { setFile } = context;
    const formdata = new FormData();
    formdata.append("file", files[idx]);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/upload", {
        method: "POST",
        body: formdata,
      });
      if (res.ok) {
        setFile(files[idx]);
      }
    } catch (err) {
      console.log("error", err);
    }
  };
  console.log(files);

  return (
    <div className="h-full border-r-2 border-slate-300 max-w-70 flex flex-col items-center w-full p-6">
      <input
        className="text-sm text-black"
        onChange={handleUpload}
        type="file"
        placeholder="upload any file"
        accept="application/pdf,application/vnd.ms-excel"
      />
      <ul className="list-disc list-inside flex-1 flex-col text-black h-full overflow-y-scroll">
        {files?.map((file, idx) => {
          return (
            <li onClick={() => handleSelectFile(idx)} key={idx}>
              {file?.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Panel;
