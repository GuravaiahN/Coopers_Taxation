'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Upload, FileText, X, CheckCircle, ChevronDown, ChevronUp, ChevronRight, Info, AlertCircle } from 'lucide-react';

const DocumentUpload = () => {
  const { data: session, status } = useSession();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [llcExpanded, setLlcExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    taxYear: new Date().getFullYear().toString(),
    notes: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form with user session data
  useEffect(() => {
    if (session?.user) {
      setClientInfo(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email
      }));
    }
  }, [session]);

  const documentChecklist = [
    'W-2 Forms (from all employers)',
    '1099 Forms (Interest, Dividends, Miscellaneous Income)',
    'Social Security Cards for all family members',
    'Bank Statements (for direct deposit)',
    'Previous Year Tax Return',
    'Receipts for Deductible Expenses',
    'Mortgage Interest Statement (1098)',
    'Property Tax Records',
    'Charitable Contribution Receipts',
    'Medical Expense Receipts',
    'Business Income and Expense Records',
    'Investment Income Statements',
    'Retirement Account Statements (401k, IRA)',
    'Health Insurance Forms (1095-A, B, or C)',
    'Student Loan Interest Statement (1098-E)',
    'Childcare Provider Information'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
    setError('');
    setSuccess('');
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!session) {
      setError('You must be logged in to upload documents.');
      return;
    }
    
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one document.');
      return;
    }

    setUploading(true);

    try {
      // Upload each file individually
      const uploadPromises = uploadedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file); // Changed from 'document' to 'file'
        formData.append('clientInfo', JSON.stringify({
          name: clientInfo.name,
          email: clientInfo.email,
          phone: clientInfo.phone,
        }));
        formData.append('notes', clientInfo.notes);
        formData.append('taxYear', clientInfo.taxYear);

        const response = await fetch('/api/documents', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        return response.json();
      });

      await Promise.all(uploadPromises);

      setSuccess(`Successfully uploaded ${uploadedFiles.length} document(s)! We'll review and contact you within 24 hours.`);
      
      // Reset form but keep user info
      setUploadedFiles([]);
      setClientInfo(prev => ({
        ...prev,
        notes: '',
        taxYear: new Date().getFullYear().toString()
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to upload documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setClientInfo({
      ...clientInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="upload" className="py-20 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-4">
            <Upload className="h-4 w-4 mr-2" />
            Secure Document Upload
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Tax Documents</h2>
          <p className="text-xl text-gray-600">
            Securely upload your documents for professional tax preparation with bank-level encryption.
          </p>
        </div>

        {/* Document Checklist Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 flex items-center justify-between hover:border-red-300 hover:bg-red-50 transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-700 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900">Required Documents Checklist</h3>
                <p className="text-gray-600">Click to view the complete list of documents you may need</p>
              </div>
            </div>
            {showChecklist ? (
              <ChevronUp className="h-6 w-6 text-gray-400" />
            ) : (
              <ChevronDown className="h-6 w-6 text-gray-400" />
            )}
          </button>

          {showChecklist && (
            <div className="mt-4 bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Document Checklist</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documentChecklist.map((document, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{document}</span>
                  </div>
                ))}
                
                {/* LLC Expandable Section */}
                <div className="col-span-1 md:col-span-2">
                  <button
                    onClick={() => setLlcExpanded(!llcExpanded)}
                    className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-2 h-2 bg-red-700 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm font-medium">LLC Business Documents</span>
                    {llcExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  
                  {llcExpanded && (
                    <div className="ml-8 mt-2 space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">SLLC (Single-Member LLC) Documents</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">MLLC (Multi-Member LLC) Documents</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">C-Corp Tax Documents</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">S-Corp Tax Documents</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You don&apos;t need all these documents. Upload what you have, and we&apos;ll let you know if we need anything else.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Client Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Client Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={clientInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-200"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={clientInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={clientInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-200"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="taxYear" className="block text-sm font-medium text-gray-900 mb-2">
                    Tax Year
                  </label>
                  <select
                    id="taxYear"
                    name="taxYear"
                    value={clientInfo.taxYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-200"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={clientInfo.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-200"
                  placeholder="Any specific questions or information..."
                ></textarea>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Upload Documents
              </h3>
              
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-red-700 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-4">
                  <div className="bg-red-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Drag and drop your files here, or click to browse
                    </p>
                    <p className="text-sm text-gray-600">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Choose Files
                  </button>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
                  
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="bg-red-700 p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-red-700" />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 text-red-700 hover:text-red-800 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Secure Document Handling</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• All uploads are encrypted with bank-level security</li>
                    <li>• Documents stored in secure, HIPAA-compliant servers</li>
                    <li>• Files automatically deleted after tax season</li>
                    <li>• Only authorized professionals have access</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={uploading || uploadedFiles.length === 0}
                className="bg-red-700 text-white px-8 py-4 rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>Submit Documents</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DocumentUpload;