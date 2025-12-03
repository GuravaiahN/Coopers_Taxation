'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import * as XLSX from 'xlsx';
import SearchBar from './searchBar'; // Assume SearchBar is reusable

const ContactFormData = ({ isAdmin }: { isAdmin: boolean }) => {
  const { data: session } = useSession();
  const [contactData, setContactData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10; // Number of items per page

  const fetchContactData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/contact-data?page=${page}&limit=${limit}`,
          { cache: 'no-store' }
        );
        const result = await response.json();

        if (result.success) {
          const allData = result.data;

          if (!isAdmin && session?.user?.email) {
            const userSpecificData = allData.filter(
              (contact: any) => contact.email === session.user.email
            );
            setContactData(userSpecificData);
            setFilteredData(userSpecificData);
          } else {
            setContactData(allData);
            setFilteredData(allData);
          }

          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, session?.user?.email]
  );

  useEffect(() => {
    fetchContactData(currentPage);
  }, [currentPage, fetchContactData]);

  const exportToExcel = (data: any[], fileName: string) => {
    const formattedData = data.map(
      ({ name, email, phone, message, createdAt }) => ({
        Name: name,
        Email: email,
        Phone: phone,
        Message: message || 'N/A',
        Date: new Date(createdAt).toLocaleString(),
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ContactFormData');
    XLSX.writeFile(workbook, fileName);
  };

  const handleExportPageData = () => {
    exportToExcel(filteredData, `ContactFormData_Page_${currentPage}.xlsx`);
  };

  const handleExportAllData = async () => {
    try {
      const response = await fetch('/api/contact-data?export=all', {
        cache: 'no-store',
      });
      const result = await response.json();

      if (result.success) {
        exportToExcel(result.data, 'ContactFormData_AllData.xlsx');
      }
    } catch (error) {
      console.error('Error exporting all data:', error);
    }
  };

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const filtered = contactData.filter(({ name, email }) =>
        `${name || ''} ${email || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    },
    [contactData]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-poppins mb-4 text-center">
        US Inquires obtained from Contact Form Page
      </h2>
      {isAdmin && (
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={handleExportAllData}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Export All Data
          </button>
          <button
            onClick={handleExportPageData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Export Page Data
          </button>
        </div>
      )}
      <SearchBar onSearch={handleSearch} />
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">S.No</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Message</th>
                <th className="border border-gray-300 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((contact, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">{contact.name}</td>
                  <td className="border border-gray-300 p-2">
                    {contact.email}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {contact.phone}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {contact.message}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
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
      ) : (
        <p>No contact form data available.</p>
      )}
    </div>
  );
};

export default ContactFormData;
