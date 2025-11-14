"use client";
import React, { createContext, useState } from "react";
type FileSelectContextType = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  messageLoading: boolean;
  setMessageLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const FileSelectContext = createContext<FileSelectContextType | null>(
  null
);
const FileSelectContextWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  return (
    <FileSelectContext.Provider
      value={{ file, setFile, messageLoading, setMessageLoading }}
    >
      {children}
    </FileSelectContext.Provider>
  );
};

export default FileSelectContextWrapper;
