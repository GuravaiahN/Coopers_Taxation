'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { FaDownload, FaSpinner, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

interface DocumentFile {
  _id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  originalName: string;
  filename?: string;
  fileId?: string;
  size?: number;
  mimeType?: string;
  status?: string;
  taxYear?: string;
  notes?: string;
  clientInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

const AdminFiles: React.FC = () => {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTaxYear, setSelectedTaxYear] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    try {
      const response = await fetch('/api/admin-files');
      const data = await response.json();

      if (data.success) {
        // Handle both data structures: paginated (users) and export (data)
        const filesData = data.users || data.data || data.files || [];
        setFiles(filesData);
      } else {
        setError(data.message || 'Failed to fetch files');
        setFiles([]); // Reset to empty array on error
      }
    } catch (err) {
      setError('An error occurred while fetching files');
      setFiles([]); // Reset to empty array on error
      console.error('Error fetching admin files:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const userName = (file.userName || file.clientInfo?.name || '').toLowerCase();
      const userEmail = (file.userEmail || file.clientInfo?.email || '').toLowerCase();
      const fileName = (file.filename || file.originalName || '').toLowerCase();
      const notes = (file.notes || '').toLowerCase();
      const phone = (file.clientInfo?.phone || '').toLowerCase();
      
      // Search filter
      const matchesSearch = searchTerm === '' || 
        userName.includes(searchTerm.toLowerCase()) ||
        userEmail.includes(searchTerm.toLowerCase()) ||
        fileName.includes(searchTerm.toLowerCase()) ||
        notes.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = selectedStatus === 'all' || 
        (file.status || 'unknown').toLowerCase() === selectedStatus.toLowerCase();
      
      // Tax year filter
      const matchesTaxYear = selectedTaxYear === 'all' || 
        file.taxYear === selectedTaxYear;
      
      // File type filter
      const matchesFileType = selectedFileType === 'all' || 
        (file.mimeType || '').includes(selectedFileType);
      
      return matchesSearch && matchesStatus && matchesTaxYear && matchesFileType;
    });
  }, [files, searchTerm, selectedStatus, selectedTaxYear, selectedFileType]);

  // Get unique values for filter options
  const uniqueStatuses = useMemo(() => {
    const statuses = files.map(f => f.status || 'unknown');
    return Array.from(new Set(statuses)).sort();
  }, [files]);

  const uniqueTaxYears = useMemo(() => {
    const years = files.map(f => f.taxYear).filter(Boolean);
    return Array.from(new Set(years)).sort().reverse();
  }, [files]);

  const uniqueFileTypes = useMemo(() => {
    const types = files.map(f => {
      if (!f.mimeType) return 'unknown';
      if (f.mimeType.includes('pdf')) return 'pdf';
      if (f.mimeType.includes('image')) return 'image';
      if (f.mimeType.includes('word') || f.mimeType.includes('document')) return 'document';
      return 'other';
    });
    return Array.from(new Set(types)).sort();
  }, [files]);

  const handleDownload = async (fileId: string, filename: string) => {
    setDownloadLoading(fileId);
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
    } finally {
      setDownloadLoading(null);
    }
  };

  const handleDelete = async (fileId: string, filename: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    setDeleteLoading(fileId);
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh the files list
        await fetchAllFiles();
      } else {
        console.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedTaxYear('all');
    setSelectedFileType('all');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-2xl font-poppins text-[#C84B31]">All User Files ({filteredFiles.length} of {files.length})</h2>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, filename, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-80 focus:ring-2 focus:ring-[#C84B31] focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaFilter />
            Filters
            {(selectedStatus !== 'all' || selectedTaxYear !== 'all' || selectedFileType !== 'all') && (
              <span className="bg-[#C84B31] text-white text-xs px-2 py-1 rounded-full">
                {[selectedStatus, selectedTaxYear, selectedFileType].filter(f => f !== 'all').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C84B31] focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status} className="capitalize">
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Year</label>
              <select
                value={selectedTaxYear}
                onChange={(e) => setSelectedTaxYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C84B31] focus:border-transparent"
              >
                <option value="all">All Years</option>
                {uniqueTaxYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
              <select
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C84B31] focus:border-transparent"
              >
                <option value="all">All Types</option>
                {uniqueFileTypes.map(type => (
                  <option key={type} value={type} className="capitalize">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearAllFilters}
              className="text-[#C84B31] hover:text-red-700 text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {filteredFiles.length === 0 ? (
        <div className="text-center text-gray-500 p-6">
          <p className="font-poppins">
            {searchTerm || selectedStatus !== 'all' || selectedTaxYear !== 'all' || selectedFileType !== 'all' 
              ? 'No files match your search criteria.' 
              : 'No files found.'}
          </p>
          {(searchTerm || selectedStatus !== 'all' || selectedTaxYear !== 'all' || selectedFileType !== 'all') && (
            <button
              onClick={clearAllFilters}
              className="text-[#C84B31] hover:text-red-700 mt-2 text-sm"
            >
              Clear filters to see all files
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFiles.map((document) => (
            <div key={document._id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-poppins text-gray-800 font-semibold">
                  {document.userName || document.clientInfo?.name || 'Unknown User'} - {new Date(document.createdAt).toLocaleDateString()}
                </h3>
                <div className="text-sm text-gray-600 font-poppins">
                  <p>Email: {document.userEmail || document.clientInfo?.email || 'Unknown'}</p>
                  <p>Phone: {document.clientInfo?.phone || 'Not provided'}</p>
                  <p>Status: <span className="capitalize bg-gray-100 px-2 py-1 rounded">{document.status || 'Unknown'}</span></p>
                  <p>Tax Year: <span className="bg-blue-100 px-2 py-1 rounded">{document.taxYear || 'Not specified'}</span></p>
                </div>
                {document.notes && (
                  <p className="text-sm text-gray-700 font-poppins mt-2">
                    <strong>Notes:</strong> {document.notes}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-md font-poppins text-gray-700 font-medium mb-2">Document:</h4>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                  <div className="flex-1">
                    <p className="text-sm font-poppins text-gray-800 truncate">
                      {document.filename || document.originalName}
                    </p>
                    <p className="text-xs text-gray-500 font-poppins">
                      Size: {document.size ? `${Math.round(document.size / 1024)} KB` : 'Unknown'} | 
                      Type: {document.mimeType || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {document.fileId && (
                      <button
                        onClick={() => handleDownload(document.fileId!, document.filename || document.originalName || 'unknown')}
                        disabled={downloadLoading === document.fileId}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-blue-300"
                      >
                        {downloadLoading === document.fileId ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaDownload />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(document._id, document.filename || document.originalName || 'unknown')}
                      disabled={deleteLoading === document._id}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-red-300"
                    >
                      {deleteLoading === document._id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFiles;