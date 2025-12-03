'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  FaFileAlt,
  FaUpload,
  FaDownload,
  FaEye,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaSync
} from 'react-icons/fa';

interface Document {
  _id: string;
  originalName: string;
  filename: string;
  size: number;
  mimeType: string;
  status: string;
  createdAt: string;
  notes?: string;
}

interface UserStats {
  totalDocuments: number;
  pendingDocuments: number;
  processedDocuments: number;
  totalSize: number;
}

const UserDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalDocuments: 0,
    pendingDocuments: 0,
    processedDocuments: 0,
    totalSize: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // -----------------------------------------------------
  // Fetch documents
  // -----------------------------------------------------
  useEffect(() => {
    if (session) fetchUserData();
  }, [session]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/documents?limit=100');
      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      const docs = data.documents || [];

      setDocuments(docs);

      // Use stats from API if available, otherwise calculate
      if (data.stats) {
        setStats({
          totalDocuments: data.stats.total || 0,
          pendingDocuments: data.stats.processing || 0,
          processedDocuments: data.stats.completed || 0,
          totalSize: docs.reduce((acc: number, d: Document) => acc + (d.size || 0), 0)
        });
      } else {
        // Fallback calculation
        const pending = docs.filter((d: Document) =>
          ['pending', 'uploaded'].includes(d.status?.toLowerCase())
        ).length;

        const processed = docs.filter((d: Document) =>
          ['processed', 'completed'].includes(d.status?.toLowerCase())
        ).length;

        const size = docs.reduce((acc: number, d: Document) => acc + (d.size || 0), 0);

        setStats({
          totalDocuments: docs.length,
          pendingDocuments: pending,
          processedDocuments: processed,
          totalSize: size
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // Helpers
  // -----------------------------------------------------
  const getFileIcon = (mime: string) => {
    if (!mime) return <FaFileAlt className="text-gray-500" />;

    if (mime.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (mime.includes('image')) return <FaFileImage className="text-blue-500" />;
    if (mime.includes('word')) return <FaFileWord className="text-indigo-600" />;

    return <FaFileAlt className="text-gray-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processed':
      case 'completed':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
      case 'uploaded':
        return <FaClock className="text-yellow-500" />;
      case 'failed':
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'uploaded':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
  };

  // -----------------------------------------------------
  // Filtering
  // -----------------------------------------------------
  const filteredDocuments = documents.filter((doc) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      doc.originalName.toLowerCase().includes(s) ||
      doc.filename.toLowerCase().includes(s) ||
      (doc.notes?.toLowerCase().includes(s) || false);

    const matchesStatus =
      statusFilter === 'all' || doc.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // -----------------------------------------------------
  // Downloads
  // -----------------------------------------------------
  const handleDownload = async (id: string, filename: string) => {
    try {
      const response = await fetch(`/api/user/documents/${id}/download`);
      if (!response.ok) return;

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------------------------------------
  // Loading Skeleton
  // -----------------------------------------------------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );

  // -----------------------------------------------------
  // Error
  // -----------------------------------------------------
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Welcome back, {session?.user?.name}
            </h1>
            <p className="text-gray-600">Manage your uploaded documents</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchUserData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaSync className="mr-2" />
              Refresh
            </button>

            <button
              onClick={() => (window.location.href = '/upload')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FaUpload className="mr-2" />
              Upload
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Documents" value={stats.totalDocuments} color="blue" icon={<FaFileAlt />} />
          <StatCard label="Pending Review" value={stats.pendingDocuments} color="yellow" icon={<FaClock />} />
          <StatCard label="Processed" value={stats.processedDocuments} color="green" icon={<FaCheckCircle />} />
          <StatCard label="Total Size" value={formatFileSize(stats.totalSize)} color="purple" icon={<FaCalendarAlt />} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">

            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="border rounded-lg px-3 py-2 w-full md:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="uploaded">Uploaded</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Documents */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow">
            <FaFileAlt className="mx-auto text-gray-400 text-5xl mb-3" />
            <p className="text-gray-600">No documents found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc._id}
                doc={doc}
                getFileIcon={getFileIcon}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                formatFileSize={formatFileSize}
                handleDownload={handleDownload}
                setSelectedDocument={setSelectedDocument}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedDocument && (
          <Modal
            doc={selectedDocument}
            formatFileSize={formatFileSize}
            getStatusColor={getStatusColor}
            close={() => setSelectedDocument(null)}
            handleDownload={handleDownload}
          />
        )}

      </div>
    </div>
  );
};

/* -------------------------
   COMPONENTS
--------------------------*/

const StatCard = ({
  label,
  value,
  color,
  icon
}: any) => (
  <div className="bg-white p-6 rounded-lg shadow border-l-4"
    style={{ borderLeftColor: `${color}` }}
  >
    <div className="flex justify-between">
      <div>
        <p className="text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <div className="text-gray-300 text-3xl">{icon}</div>
    </div>
  </div>
);

const DocumentCard = ({
  doc,
  getFileIcon,
  getStatusIcon,
  getStatusColor,
  formatFileSize,
  handleDownload,
  setSelectedDocument
}: any) => (
  <div className="bg-white shadow rounded-lg p-6 hover:shadow-xl transition">
    <div className="flex justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{getFileIcon(doc.mimeType)}</div>
        <div>
          <p className="font-medium truncate w-40">{doc.originalName}</p>
          <p className="text-gray-500 text-sm">{formatFileSize(doc.size)}</p>
        </div>
      </div>
      {getStatusIcon(doc.status)}
    </div>

    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.status)}`}>
      {doc.status}
    </span>

    <div className="mt-4 text-gray-600 flex items-center">
      <FaCalendarAlt className="mr-2" />
      {new Date(doc.createdAt).toLocaleDateString()}
    </div>

    {doc.notes && (
      <p className="mt-3 bg-gray-50 p-2 rounded text-sm text-gray-600">
        {doc.notes}
      </p>
    )}

    <div className="flex justify-between items-center mt-4 pt-4 border-t">
      <button
        onClick={() => setSelectedDocument(doc)}
        className="text-blue-600 hover:underline text-sm flex items-center"
      >
        <FaEye className="mr-1" /> View
      </button>

      <button
        onClick={() => handleDownload(doc._id, doc.originalName)}
        className="text-green-600 hover:underline text-sm flex items-center"
      >
        <FaDownload className="mr-1" /> Download
      </button>
    </div>
  </div>
);

const Modal = ({
  doc,
  close,
  getStatusColor,
  formatFileSize,
  handleDownload
}: any) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Document Details</h2>
        <button onClick={close} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <p><strong>Name:</strong> {doc.originalName}</p>
        <p><strong>Size:</strong> {formatFileSize(doc.size)}</p>
        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${getStatusColor(doc.status)}`}>{doc.status}</span></p>
        <p><strong>Uploaded:</strong> {new Date(doc.createdAt).toLocaleString()}</p>

        {doc.notes && (
          <p><strong>Notes:</strong> {doc.notes}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => handleDownload(doc._id, doc.originalName)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          <FaDownload className="inline-block mr-2" />
          Download
        </button>
        <button onClick={close} className="bg-gray-300 px-4 py-2 rounded-lg">
          Close
        </button>
      </div>
    </div>
  </div>
);

export default UserDashboard;
