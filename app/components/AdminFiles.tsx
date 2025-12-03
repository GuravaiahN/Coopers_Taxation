'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { FaFileAlt, FaFilePdf, FaFileImage, FaDownload, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  documents: { _id: string; filename: string }[];
  additionalDocuments?: { _id: string; filename: string }[];
  createdAt: string;
  status?: string;
  taxYear?: string;
  notes?: string;
}

const AdminFiles: React.FC = () => {
  const [fileData, setFileData] = useState<UserData[]>([]);
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taxYearFilter, setTaxYearFilter] = useState('all');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Generate unique filter options
  const uniqueStatuses = useMemo(() => {
    const statuses = fileData.map(f => f.status || 'uploaded');
    return Array.from(new Set(statuses)).sort();
  }, [fileData]);

  const uniqueTaxYears = useMemo(() => {
    const years = fileData.map(f => f.taxYear).filter(Boolean);
    return Array.from(new Set(years)).sort().reverse();
  }, [fileData]);

  const uniqueFileTypes = useMemo(() => {
    const types = fileData.flatMap(user => [
      ...user.documents.map(doc => {
        if (!doc || !doc.filename) return 'Other';
        const extension = doc.filename.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') return 'PDF';
        if (extension && ['jpg', 'jpeg', 'png'].includes(extension)) return 'Image';
        if (extension && ['doc', 'docx'].includes(extension)) return 'Document';
        return 'Other';
      }),
      ...(user.additionalDocuments?.map(doc => {
        if (!doc || !doc.filename) return 'Other';
        const extension = doc.filename.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') return 'PDF';
        if (extension && ['jpg', 'jpeg', 'png'].includes(extension)) return 'Image';
        if (extension && ['doc', 'docx'].includes(extension)) return 'Document';
        return 'Other';
      }) || [])
    ]);
    return Array.from(new Set(types)).sort();
  }, [fileData]);

  // Advanced search and filter function
  const filteredResults = useMemo(() => {
    return fileData.filter(user => {
      // Search term filter (searches across multiple fields)
      const searchString = `${user.fullName || ''} ${user.email || ''} ${user.phone || ''} ${user.message || ''}`.toLowerCase();
      const documentNames = [...(user.documents || []), ...(user.additionalDocuments || [])]
        .filter(doc => doc && doc.filename)
        .map(doc => doc.filename)
        .join(' ')
        .toLowerCase();
      const matchesSearch = !searchTerm || searchString.includes(searchTerm.toLowerCase()) || documentNames.includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || (user.status || 'uploaded') === statusFilter;

      // Tax year filter
      const matchesTaxYear = taxYearFilter === 'all' || user.taxYear === taxYearFilter;

      // File type filter
      if (fileTypeFilter !== 'all') {
        const userFileTypes = [...(user.documents || []), ...(user.additionalDocuments || [])]
          .filter(doc => doc && doc.filename)
          .map(doc => {
            const extension = doc.filename.split('.').pop()?.toLowerCase();
            if (extension === 'pdf') return 'PDF';
            if (extension && ['jpg', 'jpeg', 'png'].includes(extension)) return 'Image';
            if (extension && ['doc', 'docx'].includes(extension)) return 'Document';
            return 'Other';
          });
        const matchesFileType = userFileTypes.includes(fileTypeFilter as any);
        return matchesSearch && matchesStatus && matchesTaxYear && matchesFileType;
      }

      return matchesSearch && matchesStatus && matchesTaxYear;
    });
  }, [fileData, searchTerm, statusFilter, taxYearFilter, fileTypeFilter]);

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

  useEffect(() => {
    setFilteredData(filteredResults);
  }, [filteredResults]);

  const exportToExcel = (data: UserData[], fileName: string) => {
    const formattedData = data.map((user) => ({
      Name: user.fullName || '',
      Email: user.email || '',
      Phone: user.phone || '',
      Message: user.message || '',
      Status: user.status || 'uploaded',
      TaxYear: user.taxYear || 'N/A',
      Notes: user.notes || 'N/A',
      Date: new Date(user.createdAt).toLocaleString(),
      Documents: (user.documents || [])
        .filter(doc => doc && doc.filename)
        .map((doc) => doc.filename)
        .join(', ') || 'N/A',
      'Additional Documents': (user.additionalDocuments || [])
        .filter(doc => doc && doc.filename)
        .map((doc) => doc.filename)
        .join(', ') || 'N/A',
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

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTaxYearFilter('all');
    setFileTypeFilter('all');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen font-poppins">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Admin Dashboard - File Management
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Manage and search through client documents and submissions
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <div className="text-4xl opacity-80">👤</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Files</p>
                  <p className="text-2xl font-bold">{totalFiles}</p>
                </div>
                <div className="text-4xl opacity-80">📁</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Filtered Results</p>
                  <p className="text-2xl font-bold">{filteredData.length}</p>
                </div>
                <div className="text-4xl opacity-80">🔍</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, message, or filename..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <FaFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Year</label>
                <select
                  value={taxYearFilter}
                  onChange={(e) => setTaxYearFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Years</option>
                  {uniqueTaxYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                <select
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {uniqueFileTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleExportAllData}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FaDownload />
              Export All Data
            </button>
            <button
              onClick={handleExportPageData}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FaDownload />
              Export Filtered Data
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Documents</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{user.message || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {user.documents.map((doc) => (
                            <div key={doc._id} className="flex items-center space-x-2">
                              {getFileIcon(doc.filename)}
                              <a
                                href={`/api/files/${doc._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-40"
                              >
                                {doc.filename}
                              </a>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {user.additionalDocuments?.map((doc) => (
                            <div key={doc._id} className="flex items-center space-x-2">
                              {getFileIcon(doc.filename)}
                              <a
                                href={`/api/files/${doc._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-40"
                              >
                                {doc.filename}
                              </a>
                            </div>
                          )) || <span className="text-gray-400 text-sm">N/A</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-4xl mb-2">📁</div>
                        <p>No files found matching your criteria.</p>
                        <button
                          onClick={clearFilters}
                          className="mt-2 text-blue-600 hover:text-blue-800 underline"
                        >
                          Clear filters to see all files
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filteredData.length > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 rounded-l-md"
                      >
                        Previous
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 rounded-r-md"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFiles;