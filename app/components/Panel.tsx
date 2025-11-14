"use client";
import React, { useContext, useState } from "react";
import { FileSelectContext } from "../context/FileSelectContextWrapper";

interface PanelProps {
  onClose?: () => void;
}

const Panel = ({ onClose }: PanelProps) => {
  const context = useContext(FileSelectContext);

  const [files, setFiles] = useState<Array<File>>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Set<number>>(new Set());
  
  const showError = (message: string) => {
    setUploadError(message);
    setTimeout(() => setUploadError(null), 5000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showError("Please select a PDF file only.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showError("File size must be less than 10MB.");
      return;
    }

    const isDuplicate = files.some(existingFile => 
      existingFile.name === file.name && existingFile.size === file.size
    );
    
    if (isDuplicate) {
      showError("This file has already been uploaded.");
      return;
    }

    setFiles([...files, file]);
    setUploadError(null);
    
    e.target.value = '';
  };

  const handleSelectFile = async (idx: number) => {
    if (!context) {
      showError("Context not available. Please refresh the page.");
      return;
    }
    
    const { setFile } = context;
    const selectedFile = files[idx];
    
    if (!selectedFile) {
      showError("Selected file not found.");
      return;
    }

    setUploadingFiles(prev => new Set([...prev, idx]));
    setUploadError(null);
    
    const formdata = new FormData();
    formdata.append("file", selectedFile);
    
    try {
      if (!process.env.NEXT_PUBLIC_SERVER_URL) {
        throw new Error("Server URL not configured. Please check your environment variables.");
      }

      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/upload", {
        method: "POST",
        body: formdata,
        signal: AbortSignal.timeout(60000), // 60 second timeout for file upload
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Upload failed: ${res.status} ${res.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await res.json().catch(() => ({}));
      setFile(selectedFile);
      
    } catch (err) {
      
      let errorMessage = "Failed to upload file. Please try again.";
      
      if (err instanceof Error) {
        if (err.name === 'TimeoutError') {
          errorMessage = "Upload timed out. The file might be too large or the server is busy.";
        } else if (err.message.includes('fetch')) {
          errorMessage = "Unable to connect to the server. Please check your internet connection.";
        } else {
          errorMessage = err.message;
        }
      }
      
      showError(errorMessage);
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(idx);
        return newSet;
      });
    }
  };

  return (
    <div className="h-screen lg:h-full bg-white border-r border-gray-200 w-80 flex flex-col shadow-lg relative">
      {uploadError && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-xs flex-1">{uploadError}</span>
          <button 
            onClick={() => setUploadError(null)}
            className="hover:bg-red-600 rounded p-0.5"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
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

      <div className="flex-1 overflow-y-auto">
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
                const isUploading = uploadingFiles.has(idx);
                return (
                  <li 
                    onClick={() => !isUploading && handleSelectFile(idx)} 
                    key={idx}
                    className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 ${
                      isUploading 
                        ? 'cursor-wait bg-blue-50 border-blue-200' 
                        : isSelected 
                        ? 'bg-blue-50 border-blue-200 shadow-md cursor-pointer' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                        isUploading ? 'bg-blue-200' : isSelected ? 'bg-blue-100' : 'bg-white'
                      }`}>
                        {isUploading ? (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            isSelected ? 'text-blue-600' : 'text-gray-400'
                          }`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium truncate ${
                          isUploading ? 'text-blue-900' : isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {file?.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {isUploading ? 'Uploading...' : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </div>
                      {isSelected && !isUploading && (
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
