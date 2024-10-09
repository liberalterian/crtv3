'use client';

import React, { useState } from 'react';
import { upload } from 'thirdweb/storage';
import { client } from '@app/lib/sdk/thirdweb/client';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void; // {{ edit_5 }}
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  // {{ edit_6 }}
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedUri, setUploadedUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file); // Notify parent component of the selected file
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Access API keys from environment variables
      const uri = await upload({
        client,
        files: [selectedFile],
      });

      setUploadedUri(uri);
    } catch (err) {
      setError('Error uploading file: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#1a1c1f] px-4 py-10">
      <div className="w-full rounded-lg p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-semibold text-gray-200">
          Upload A File
        </h1>

        {/* File Input */}
        <div className="mb-6">
          <label
            htmlFor="file-upload"
            className="mb-2 block text-sm font-medium text-gray-400"
          >
            Choose A File To Upload:
          </label>
          <input
            type="file"
            id="file-upload"
            accept="video/*"
            className="block w-full text-sm
                       text-[#EC407A] file:mr-4 file:rounded-full
                       file:border-0 file:bg-white
                       file:px-4 file:py-2
                       file:text-sm file:font-semibold
                       file:text-[#EC407A] hover:file:bg-gray-200"
            onChange={handleFileChange}
          />
        </div>

        {/* Upload Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleFileUpload}
            disabled={!selectedFile || uploading}
            className={`${
              uploading
                ? 'cursor-not-allowed bg-[#D63A6A]' // Change disabled color if needed
                : 'bg-[#EC407A] hover:bg-[#D63A6A]' // Change button color
            } cursor-pointer rounded-lg px-4 py-2 font-semibold text-white`}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Success Message */}
        {uploadedUri && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-green-700">
              File uploaded successfully! IPFS URI:{' '}
              <a
                href={uploadedUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 underline"
              >
                {uploadedUri}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
