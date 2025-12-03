'use client';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaSpinner } from 'react-icons/fa';
import useSessionStore from '@/stores/useSessionStore';

interface UserFile {
  _id: string;
  filename: string;
  createdAt: string;
}

interface RefundRequest {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
  documents: UserFile[];
  additionalDocuments: UserFile[];
}

const UserFiles: React.FC = () => {
  const { session } = useSessionStore();
  const [files, setFiles] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserFiles = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user-files?email=${encodeURIComponent(session.user.email)}`);
        const data = await response.json();

        if (data.success) {
          setFiles(data.files);
        } else {
          setError(data.message || 'Failed to fetch files');
        }
      } catch (err) {
        setError('An error occurred while fetching files');
        console.error('Error fetching user files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFiles();
  }, [session]);

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#C84B31]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        <p className="font-poppins">{error}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center text-gray-500 p-6">
        <p className="font-poppins">No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-poppins text-[#C84B31] mb-4">Your Uploaded Files</h2>
      
      {files.map((request) => (
        <div key={request._id} className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-poppins text-gray-800 font-semibold">
              Refund Request - {new Date(request.createdAt).toLocaleDateString()}
            </h3>
            <p className="text-sm text-gray-600 font-poppins">Status: <span className="capitalize">{request.status}</span></p>
          </div>

          {request.documents.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-poppins text-gray-700 font-medium mb-2">Documents:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {request.documents.map((file) => (
                  <div key={file._id} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                    <div className="flex-1">
                      <p className="text-sm font-poppins text-gray-800 truncate">{file.filename}</p>
                      <p className="text-xs text-gray-500 font-poppins">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(file._id, file.filename)}
                      className="ml-3 text-[#C84B31] hover:text-[#a84028] transition-colors"
                      title="Download file"
                    >
                      <FaDownload />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {request.additionalDocuments && request.additionalDocuments.length > 0 && (
            <div>
              <h4 className="text-md font-poppins text-gray-700 font-medium mb-2">Additional Documents:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {request.additionalDocuments.map((file) => (
                  <div key={file._id} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                    <div className="flex-1">
                      <p className="text-sm font-poppins text-gray-800 truncate">{file.filename}</p>
                      <p className="text-xs text-gray-500 font-poppins">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(file._id, file.filename)}
                      className="ml-3 text-[#C84B31] hover:text-[#a84028] transition-colors"
                      title="Download file"
                    >
                      <FaDownload />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserFiles;