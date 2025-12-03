'use client';
import React, { useState, useEffect } from 'react';
import useSessionStore from '@/stores/useSessionStore'; // Import useSessionStore
import { FaFileAlt, FaFilePdf, FaFileImage } from 'react-icons/fa';

interface Document {
  _id: string;
  filename: string;
}

interface Request {
  createdAt: string;
  documents: Document[];
  additionalDocuments?: Document[];
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

interface UserFilesByYear {
  [year: string]: Request[];
}

const UserFiles: React.FC = () => {
  const { session, loading: sessionLoading } = useSessionStore(); // Use session and loading state from useSessionStore
  const [userFiles, setUserFiles] = useState<UserFilesByYear>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserFiles = async () => {
        try {
          const response = await fetch(
            `/api/user-files?email=${session.user.email}`
          );
          const result = await response.json();

          if (result.success) {
            const filesByYear = result.files.reduce(
              (acc: UserFilesByYear, file: Request) => {
                const year = new Date(file.createdAt).getFullYear();
                if (!acc[year]) acc[year] = [];
                acc[year].push(file);
                return acc;
              },
              {}
            );

            setUserFiles(filesByYear);
          } else {
            setError('Failed to load files.');
          }
        } catch (error) {
          console.error('Error fetching user files:', error);
          setError('An error occurred while fetching your files.');
        } finally {
          setLoading(false);
        }
      };
      fetchUserFiles();
    }
  }, [session]);

  const getFileIcon = (fileName: string | undefined) => {
    if (!fileName) return <FaFileAlt className="text-gray-800 w-6 h-6" />;
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 w-6 h-6" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage className="text-blue-500 w-6 h-6" />;
      default:
        return <FaFileAlt className="text-gray-800 w-6 h-6" />;
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg sm:text-xl md:text-2xl text-gray-800 font-poppins">
          Loading files...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg sm:text-xl md:text-2xl text-red-500 font-poppins">
          {error}
        </p>
      </div>
    );
  }

  return (
    <section className="bg-[#f9f7f7] py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="bg-white shadow-lg rounded-lg p-8  mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins text-[#C84B31] mb-6 text-center">
            Your Uploaded Files
          </h2>
          {Object.keys(userFiles).length > 0 ? (
            Object.entries(userFiles).map(([year, files]) => (
              <div key={year} className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-poppins text-gray-800 mb-4">
                  {year}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 p-2">S.No</th>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Phone</th>
                        <th className="border border-gray-300 p-2">Message</th>
                        <th className="border border-gray-300 p-2">
                          Documents
                        </th>
                        <th className="border border-gray-300 p-2">
                          Additional Documents
                        </th>
                        <th className="border border-gray-300 p-2">
                          Date & Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((request, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-gray-300 p-2">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {request.fullName}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {request.email}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {request.phone}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {request.message || 'N/A'}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {request.documents.map((doc) => (
                              <div
                                key={doc._id}
                                className="flex items-center space-x-2"
                              >
                                {getFileIcon(doc.filename)}
                                <a
                                  href={`/api/files/${doc._id}`}
                                  className="text-[#C84B31] hover:underline flex-grow font-poppins"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Open document ${doc.filename}`}
                                >
                                  {doc.filename || 'Unnamed Document'}
                                </a>
                              </div>
                            ))}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {request.additionalDocuments?.map((doc) => (
                              <div
                                key={doc._id}
                                className="flex items-center space-x-2"
                              >
                                {getFileIcon(doc.filename)}
                                <a
                                  href={`/api/files/${doc._id}`}
                                  className="text-[#C84B31] hover:underline flex-grow font-poppins"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Open additional document ${doc.filename}`}
                                >
                                  {doc.filename || 'Unnamed Document'}
                                </a>
                              </div>
                            )) || 'N/A'}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {new Date(request.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 font-poppins">
              No files uploaded yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserFiles;
