'use client';
import React, { useEffect, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { FaSpinner } from 'react-icons/fa';
import SearchBar from './searchBar'; // Assume SearchBar is reusable

interface User {
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const RegisteredUsers: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const limit = 10;

  const fetchUsers = async (page: number, exportAll = false) => {
    setLoading(true);
    try {
      const queryParams = exportAll
        ? '?export=all'
        : `?page=${page}&limit=${limit}`;
      const response = await fetch(`/api/users${queryParams}`);
      const result = await response.json();

      if (result.success) {
        if (exportAll) {
          // For export all, just fetch the data
          setUsers(result.data);
          setFilteredData(result.data);
        } else {
          // For paginated data
          setUsers(result.data);
          setFilteredData(result.data);
          setTotalPages(result.totalPages);
          setTotalUsers(result.totalUsers);
          setCurrentPage(result.currentPage);
        }
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const exportToExcel = (allData = false) => {
    const dataToExport = allData ? users : filteredData;
    const formattedData = dataToExport.map((user) => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Date: new Date(user.createdAt).toLocaleString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RegisteredUsers');
    XLSX.writeFile(workbook, `RegisteredUsers${allData ? '_All' : ''}.xlsx`);
  };

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const filtered = users.filter(({ name, email }) =>
        `${name} ${email}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    },
    [users]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white min-h-screen font-poppins p-6">
      <h2 className="text-2xl  text-gray-800 mb-6 text-center">
        Total clients who have registered on our website.
      </h2>

      {isAdmin && (
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() =>
              fetchUsers(currentPage, true).then(() => exportToExcel(true))
            }
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Export All Data
          </button>
          <button
            onClick={() => exportToExcel()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export Page Data
          </button>
        </div>
      )}

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <FaSpinner className="animate-spin text-gray-500" />
        </div>
      ) : filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">S.No</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">{user.phone}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No registered users found.</p>
      )}

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

export default RegisteredUsers;
