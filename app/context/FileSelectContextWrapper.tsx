"use client"
import React, { createContext, useState } from "react";
type FileSelectContextType = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};
export const FileSelectContext = createContext<FileSelectContextType | null>(
  null
);
const FileSelectContextWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [file, setFile] = useState<File | null>(null);
  return (
    <FileSelectContext.Provider value={{ file, setFile }}>
      {children}
    </FileSelectContext.Provider>
  );
};

export default FileSelectContextWrapper;
