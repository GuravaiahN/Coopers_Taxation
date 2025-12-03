'use client';
import React, { useEffect, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import SearchBar from './searchBar';
import SummaryCards from './summaryCards';
import { FaFileAlt, FaFilePdf, FaFileImage } from 'react-icons/fa';

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  documents: { _id: string; filename: string }[];
  additionalDocuments?: { _id: string; filename: string }[];
  createdAt: string;
}

const AdminFiles: React.FC = () => {
  const [fileData, setFileData] = useState<UserData[]>([]);
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const limit = 10;

  // Function to get file icons
  const getFileIcon = useCallback((fileName: string | undefined) => {
    if (!fileName) {
      return <FaFileAlt className="text-gray-500 w-5 h-5" />;
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 w-5 h-5" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage className="text-blue-500 w-5 h-5" />;
      default:
        return <FaFileAlt className="text-gray-500 w-5 h-5" />;
    }
  }, []);

  // Fetch data from the server
  const fetchFileData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin-files?page=${page}&limit=${limit}`
      );
      const result = await response.json();

      if (result.success) {
        setFileData(result.users);
        setFilteredData(result.users);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
        setTotalUsers(result.totalUsers);
      }
    } catch (error) {
      console.error('Error fetching admin files:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalFileCount = async () => {
    try {
      const response = await fetch(`/api/admin-files?export=all`);
      const result = await response.json();

      if (result.success) {
        const fileCount = result.data.reduce(
          (acc: number, curr: UserData) =>
            acc +
            (curr.documents?.length || 0) +
            (curr.additionalDocuments?.length || 0),
          0
        );
        setTotalFiles(fileCount);
      }
    } catch (error) {
      console.error('Error fetching total file count:', error);
    }
  };

  useEffect(() => {
    fetchFileData(currentPage);
    fetchTotalFileCount();
  }, [currentPage]);

  const exportToExcel = (data: UserData[], fileName: string) => {
    const formattedData = data.map((user) => ({
      Name: user.fullName,
      Email: user.email,
      Phone: user.phone,
      Message: user.message,
      Date: new Date(user.createdAt).toLocaleString(),
      Documents: user.documents.map((doc) => doc.filename).join(', '),
      'Additional Documents': user.additionalDocuments
        ? user.additionalDocuments.map((doc) => doc.filename).join(', ')
        : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AdminFiles');
    XLSX.writeFile(workbook, fileName);
  };

  const handleExportPageData = () => {
    exportToExcel(filteredData, `AdminFiles_Page_${currentPage}.xlsx`);
  };

  const handleExportAllData = async () => {
    try {
      const response = await fetch('/api/admin-files?export=all');
      const result = await response.json();

      if (result.success) {
        exportToExcel(result.data, 'AdminFiles_AllData.xlsx');
      }
    } catch (error) {
      console.error('Error exporting all data:', error);
    }
  };

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const filtered = fileData.filter(({ fullName, email }) =>
        `${fullName} ${email}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    },
    [fileData]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white min-h-screen font-poppins p-6">
      <h2 className="text-2xl font-poppins text-gray-800 mb-6 text-center">
        Files uploaded on the Refund Estimate page by clients.
      </h2>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Summary Cards */}
      <SummaryCards totalUsers={totalUsers} totalFiles={totalFiles} />

      {/* Export Buttons */}
      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={handleExportAllData}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export All Data
        </button>
        <button
          onClick={handleExportPageData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export Page Data
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2">S.No</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Message</th>
              <th className="border border-gray-300 p-2">Documents</th>
              <th className="border border-gray-300 p-2">
                Additional Documents
              </th>
              <th className="border border-gray-300 p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border border-gray-300 p-2">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {user.fullName}
                  </td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">{user.phone}</td>
                  <td className="border border-gray-300 p-2">
                    {user.message || 'N/A'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {user.documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center space-x-2"
                      >
                        {getFileIcon(doc.filename)}
                        <a
                          href={`/api/files/${doc._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.filename}
                        </a>
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {user.additionalDocuments?.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center space-x-2"
                      >
                        {getFileIcon(doc.filename)}
                        <a
                          href={`/api/files/${doc._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.filename}
                        </a>
                      </div>
                    )) || 'N/A'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4">
                  No files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminFiles;
