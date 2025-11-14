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
    <div className="h-auto lg:h-full bg-white border-b lg:border-r lg:border-b-0 border-gray-200 w-full lg:w-72 xl:w-80 flex flex-col shadow-lg">
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="text-white text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Document Library</h2>
        <p className="text-blue-100 text-xs sm:text-sm">Upload and manage your PDF files</p>
      </div>
      
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200 rounded-lg p-3 sm:p-4 lg:p-6 text-center cursor-pointer group">
            <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-2 sm:mt-3 lg:mt-4">
              <p className="text-xs sm:text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
                <span className="font-semibold">Click to upload</span>
                <span className="hidden sm:inline"> or drag and drop</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF files only</p>
            </div>
          </div>
          <input
            className="hidden"
            onChange={handleUpload}
            type="file"
            accept="application/pdf,application/vnd.ms-excel"
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto max-h-48 lg:max-h-none">
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Uploaded Files ({files.length})</h3>
          {files.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">No files uploaded yet</p>
            </div>
          ) : (
            <ul className="space-y-1 sm:space-y-2">
              {files?.map((file, idx) => {
                const isSelected = context?.file?.name === file.name;
                return (
                  <li 
                    onClick={() => handleSelectFile(idx)} 
                    key={idx}
                    className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-200 shadow-md' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-blue-100' : 'bg-white'
                      }`}>
                        <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          isSelected ? 'text-blue-600' : 'text-gray-400'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium truncate ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {file?.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;
