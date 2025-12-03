'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaCalendarAlt,
  FaSync,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaShare,
  FaUpload,
} from 'react-icons/fa';
import * as XLSX from 'xlsx';

/* ---------------------- Types ---------------------- */
interface UserDocument {
  _id: string;
  fileId?: string;
  filename?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt: string;
  documents?: UserDocument[];
  documentCount?: number;
}

interface DashboardStats {
  totalUsers: number;
  totalDocuments: number;
  activeUsers: number;
  recentUploads: number;
}

/* ---------------------- Main Component ---------------------- */
const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDocuments: 0,
    activeUsers: 0,
    recentUploads: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Sorting & pagination
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'date' | 'documents'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // UI state
  const [showFilters, setShowFilters] = useState(false);

  // Selected user & documents
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);

  // Share/upload
  const [availableUsers, setAvailableUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UserDocument | null>(null);
  const [shareTargetEmail, setShareTargetEmail] = useState('');
  const [shareAction, setShareAction] = useState<'share' | 'copy'>('share');
  const [sharing, setSharing] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTargetEmail, setUploadTargetEmail] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  /* ---------------------- API helpers ---------------------- */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, filesRes] = await Promise.all([
        fetch('/api/admin/users?limit=100', { credentials: 'include' }),
        fetch('/api/admin/files?limit=50', { credentials: 'include' }),
      ]);

      if (!usersRes.ok || !filesRes.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const usersData = await usersRes.json();
      const filesData = await filesRes.json();

      setUsers(usersData.users || []);
      setStats({
        totalUsers: usersData.stats?.total || usersData.users?.length || 0,
        totalDocuments: filesData.stats?.total || filesData.documents?.length || 0,
        activeUsers: usersData.stats?.active || usersData.users?.length || 0,
        recentUploads: filesData.stats?.processing || 0,
      });
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailableUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users-list?limit=200', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Unable to fetch users');
      const data = await res.json();
      setAvailableUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setAvailableUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchUserDocuments = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/admin/files?search=${encodeURIComponent(email)}&limit=200`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setUserDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
      setUserDocuments([]);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /* ---------------------- Utilities ---------------------- */
  const getFileIcon = (mimeType?: string, filename?: string) => {
    const t = (mimeType || filename || '').toLowerCase();
    if (t.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (t.includes('image') || /\.(jpg|jpeg|png|gif)$/.test(t)) return <FaFileImage className="text-blue-500" />;
    if (t.includes('word') || /\.(doc|docx)$/.test(t)) return <FaFileWord className="text-blue-700" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  /* ---------------------- Filtering & sorting ---------------------- */
  const filteredUsers = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    let list = users.filter((u) => {
      const matchesSearch =
        !s ||
        (u.name || '').toLowerCase().includes(s) ||
        (u.email || '').toLowerCase().includes(s) ||
        (u.phone || '').toLowerCase().includes(s);

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    list.sort((a, b) => {
      let res = 0;
      switch (sortBy) {
        case 'name':
          res = (a.name || '').localeCompare(b.name || '');
          break;
        case 'email':
          res = (a.email || '').localeCompare(b.email || '');
          break;
        case 'documents':
          res = (a.documentCount || 0) - (b.documentCount || 0);
          break;
        case 'date':
        default:
          res = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === 'asc' ? res : -res;
    });

    return list;
  }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* ---------------------- Actions ---------------------- */
  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const exportToExcel = () => {
    const rows = filteredUsers.map((u) => ({
      Name: u.name,
      Email: u.email,
      Phone: u.phone || 'N/A',
      Role: u.role || 'user',
      Documents: u.documentCount || 0,
      Registered: new Date(u.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, `admin-users-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleViewUser = async (user: UserData) => {
    setSelectedUser(user);
    await fetchUserDocuments(user.email);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setUserDocuments([]);
  };

  const handleDownloadDocument = async (doc: UserDocument) => {
    const id = doc.fileId || doc._id;
    if (!id) {
      alert('No file id available');
      return;
    }
    try {
      const res = await fetch(`/api/files/${id}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.originalName || doc.filename || 'document';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error downloading file');
    }
  };

  const openShareModal = async (doc: UserDocument) => {
    setSelectedDocument(doc);
    setShowShareModal(true);
    await fetchAvailableUsers();
  };

  const handleShareSubmit = async () => {
    if (!selectedDocument || !shareTargetEmail.trim()) {
      alert('Please select a target user or enter email');
      return;
    }
    setSharing(true);
    try {
      const res = await fetch('/api/admin/share-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          documentId: selectedDocument._id,
          targetUserEmail: shareTargetEmail.trim(),
          action: shareAction,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Share failed');
      alert(data.message || 'Document shared');
      setShowShareModal(false);
      setShareTargetEmail('');
      if (selectedUser) fetchUserDocuments(selectedUser.email);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Error sharing document');
    } finally {
      setSharing(false);
    }
  };

  const openUploadModal = async () => {
    setShowUploadModal(true);
    await fetchAvailableUsers();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setSelectedFile(f);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || !uploadTargetEmail.trim()) {
      alert('Select file and target user');
      return;
    }
    setUploadLoading(true);
    try {
      const form = new FormData();
      form.append('file', selectedFile);
      form.append('targetUserEmail', uploadTargetEmail.trim());
      const res = await fetch('/api/admin/upload-document', { 
        method: 'POST', 
        body: form,
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload failed');
      alert(data.message || 'Uploaded');
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadTargetEmail('');
      fetchDashboardData();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  /* ---------------------- UI ---------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchDashboardData} className="px-4 py-2 bg-red-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-gray-600">Users, documents and system overview</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={fetchDashboardData} className="px-3 py-2 bg-gray-800 text-white rounded flex items-center gap-2">
              <FaSync /> Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Stat label="Total Users" value={stats.totalUsers} icon={<FaUsers />} />
          <Stat label="Total Documents" value={stats.totalDocuments} icon={<FaFileAlt />} />
          <Stat label="Active Users" value={stats.activeUsers} icon={<FaChartBar />} />
          <Stat label="Recent Uploads" value={stats.recentUploads} icon={<FaCalendarAlt />} />
        </div>

        {/* Controls */}
        <div className="bg-white border rounded p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-3 py-2 border rounded"
                placeholder="Search by name, email or phone..."
                aria-label="Search users"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowFilters((s) => !s)} className="px-3 py-2 bg-gray-500 text-white rounded flex items-center gap-2">
                <FaFilter /> Filters
              </button>
              <button onClick={openUploadModal} className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
                <FaUpload /> Upload to user
              </button>
              <button onClick={exportToExcel} className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2">
                <FaDownload /> Export
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className="border px-3 py-2 rounded">
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="border px-3 py-2 rounded">
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="documents">Documents Count</option>
                <option value="date">Registration Date</option>
              </select>

              <div className="flex gap-2">
                <button onClick={() => { setSearchTerm(''); setRoleFilter('all'); setSortBy('date'); setSortOrder('desc'); }} className="px-3 py-2 bg-red-500 text-white rounded">Clear</button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border rounded shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <Th label="Name" active={sortBy === 'name'} order={sortOrder} onClick={() => toggleSort('name')} />
                <Th label="Contact" active={sortBy === 'email'} order={sortOrder} onClick={() => toggleSort('email')} />
                <th className="px-4 py-3 text-left">Role</th>
                <Th label="Documents" active={sortBy === 'documents'} order={sortOrder} onClick={() => toggleSort('documents')} />
                <Th label="Registered" active={sortBy === 'date'} order={sortOrder} onClick={() => toggleSort('date')} />
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2"><FaEnvelope className="text-gray-400" />{user.email}</span>
                      {user.phone && <span className="flex items-center gap-2 text-gray-500"><FaPhone className="text-gray-400" />{user.phone}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">{user.role || 'user'}</span>
                  </td>
                  <td className="px-4 py-3">{user.documentCount || 0}</td>
                  <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewUser(user)} className="text-blue-600 hover:text-blue-800" title="View User"><FaEye /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 border rounded disabled:opacity-50">Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* ----- User Modal ----- */}
      {selectedUser && (
        <ModalWrapper onClose={() => {
          setSelectedUser(null);
          setUserDocuments([]);
        }}>
          <UserModal
            user={selectedUser}
            documents={userDocuments}
            onDownload={handleDownloadDocument}
            onShare={(doc) => openShareModal(doc)}
            onClose={() => {
              setSelectedUser(null);
              setUserDocuments([]);
            }}
          />
        </ModalWrapper>
      )}

      {/* ----- Share Modal ----- */}
      {showShareModal && selectedDocument && (
        <ModalWrapper onClose={() => { 
          setShowShareModal(false); 
          setSelectedDocument(null);
          setShareTargetEmail('');
          setShareAction('share');
          setSharing(false);
        }}>
          <ShareModal
            document={selectedDocument}
            loadingUsers={loadingUsers}
            users={availableUsers}
            targetEmail={shareTargetEmail}
            setTargetEmail={setShareTargetEmail}
            action={shareAction}
            setAction={setShareAction}
            onSubmit={handleShareSubmit}
            submitting={sharing}
          />
        </ModalWrapper>
      )}

      {/* ----- Upload Modal ----- */}
      {showUploadModal && (
        <ModalWrapper onClose={() => { 
          setShowUploadModal(false); 
          setSelectedFile(null); 
          setUploadTargetEmail('');
          setUploadLoading(false);
        }}>
          <UploadModal
            users={availableUsers}
            loadingUsers={loadingUsers}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            targetEmail={uploadTargetEmail}
            setTargetEmail={setUploadTargetEmail}
            onSubmit={handleUploadSubmit}
            submitting={uploadLoading}
            onCancel={() => {
              setShowUploadModal(false);
              setSelectedFile(null);
              setUploadTargetEmail('');
              setUploadLoading(false);
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

/* ---------------------- Internal Components ---------------------- */

const Stat: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="border rounded p-4 flex items-center justify-between bg-white">
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
    <div className="text-3xl text-gray-400">{icon}</div>
  </div>
);

const Th: React.FC<{ label: string; active?: boolean; order?: 'asc' | 'desc'; onClick?: () => void }> = ({ label, active, order, onClick }) => (
  <th onClick={onClick} className="px-4 py-3 text-left cursor-pointer select-none">
    <div className="flex items-center gap-2">
      <span>{label}</span>
      {active && (order === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />)}
    </div>
  </th>
);

const ModalWrapper: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
    <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-auto">{children}</div>
  </div>
);

const UserModal: React.FC<{
  user: UserData;
  documents: UserDocument[];
  onDownload: (d: UserDocument) => void;
  onShare: (d: UserDocument) => void;
  onClose: () => void;
}> = ({ user, documents, onDownload, onShare, onClose }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">Role</p>
          <p className="font-medium">{user.role || 'user'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">Documents</p>
          <p className="font-medium">{documents.length}</p>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Uploaded Documents</h4>
        {documents.length === 0 ? (
          <p className="text-gray-500">No documents uploaded.</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div className="flex items-center justify-between border rounded p-3" key={doc._id}>
                <div className="flex items-center gap-3">
                  <div className="text-xl">{getFileIconFallback(doc)}</div>
                  <div>
                    <p className="font-medium">{doc.originalName || doc.filename}</p>
                    <p className="text-xs text-gray-500">{doc.size ? `${(doc.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'} • {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button title="Download" onClick={() => onDownload(doc)} className="p-2 rounded hover:bg-gray-50">
                    <FaDownload className="text-blue-600" />
                  </button>
                  <button title="Share" onClick={() => onShare(doc)} className="p-2 rounded hover:bg-gray-50">
                    <FaShare className="text-green-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-right">
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
          Close
        </button>
      </div>
    </div>
  );
};

const ShareModal: React.FC<{
  document: UserDocument;
  users: UserData[];
  loadingUsers: boolean;
  targetEmail: string;
  setTargetEmail: (s: string) => void;
  action: 'share' | 'copy';
  setAction: (a: 'share' | 'copy') => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}> = ({ document, users, loadingUsers, targetEmail, setTargetEmail, action, setAction, onSubmit, submitting }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Share Document</h3>

      <p className="text-sm text-gray-600 mb-4">Document: <span className="font-medium">{document.originalName || document.filename}</span></p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Target User</label>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <>
            <select value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} className="w-full border px-3 py-2 rounded mb-2">
              <option value="">Select user (or type email below)</option>
              {users.map((u) => (<option key={u._id} value={u.email}>{u.name} — {u.email}</option>))}
            </select>

            <input value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} placeholder="Or enter email manually" className="w-full border px-3 py-2 rounded" />
          </>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Action</label>
        <select value={action} onChange={(e) => setAction(e.target.value as any)} className="w-full border px-3 py-2 rounded">
          <option value="share">Transfer ownership</option>
          <option value="copy">Create copy for user</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button onClick={onSubmit} disabled={submitting || !targetEmail.trim()} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
          {submitting ? 'Sharing...' : 'Share Document'}
        </button>
        <button onClick={() => { /* closed by wrapper */ }} className="flex-1 bg-gray-100 px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

const UploadModal: React.FC<{
  users: UserData[];
  loadingUsers: boolean;
  selectedFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  targetEmail: string;
  setTargetEmail: (s: string) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
  onCancel: () => void;
}> = ({ users, loadingUsers, selectedFile, onFileSelect, targetEmail, setTargetEmail, onSubmit, submitting, onCancel }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Document to User</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">File</label>
        <input type="file" onChange={onFileSelect} className="w-full" />
        {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Target User</label>
        {loadingUsers ? <p>Loading users...</p> : (
          <>
            <select value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} className="w-full border px-3 py-2 rounded mb-2">
              <option value="">Select user (or type email below)</option>
              {users.map((u) => (<option key={u._id} value={u.email}>{u.name} — {u.email}</option>))}
            </select>
            <input value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Or enter email manually" />
          </>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={onSubmit} disabled={submitting || !selectedFile || !targetEmail.trim()} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
          {submitting ? 'Uploading...' : 'Upload Document'}
        </button>
        <button onClick={() => { /* closed by wrapper */ }} className="flex-1 bg-gray-100 px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

/* ---------------------- Small helpers ---------------------- */
const getFileIconFallback = (doc: UserDocument) => {
  const t = (doc.mimeType || doc.filename || '').toLowerCase();
  if (t.includes('pdf')) return <FaFilePdf className="text-red-500" />;
  if (t.includes('image') || /\.(jpg|jpeg|png|gif)$/.test(t)) return <FaFileImage className="text-blue-500" />;
  if (t.includes('word') || /\.(doc|docx)$/.test(t)) return <FaFileWord className="text-blue-700" />;
  return <FaFileAlt className="text-gray-500" />;
};

export default AdminDashboard;
