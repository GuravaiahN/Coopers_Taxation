// DocumentUpload.tsx

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaTrashAlt,
  FaDownload,
  FaUpload,
} from 'react-icons/fa';

interface DocumentUploadProps {
  documents: (File | null)[];
  setDocuments: React.Dispatch<React.SetStateAction<(File | null)[]>>;
  additionalDocuments: File[];
  setAdditionalDocuments: React.Dispatch<React.SetStateAction<File[]>>;
}

const documentNames = [
  { name: 'Individual Tax Organizer_Single', downloadLink: '/dummy1.docx' },
  { name: 'Individual Tax Organizer_Married', downloadLink: '/dummy2.docx' },
  { name: 'MMLLC Tax Organizer', downloadLink: '/dummy3.docx' },
  { name: 'SMLLC Tax Organizer', downloadLink: '/dummy4.docx' },
  { name: 'S Corp Tax Organizer', downloadLink: '/dummy5.docx' },
  { name: 'C Corp Tax Organizer', downloadLink: '/dummy6.docx' },
  { name: 'Rental Property Tax Organizer', downloadLink: '/dummy7.docx' },
  { name: 'Payroll Organizer', downloadLink: '/dummy8.docx' },
  { name: 'Employee Information', downloadLink: '/dummy9.docx' },
  { name: 'Form W4', downloadLink: '/dummy10.docx' },
  { name: 'Bookkeeping Organizer (PDF)', downloadLink: '/dummy11.pdf' },
  { name: 'Bookkeeping Organizer (XLS)', downloadLink: '/dummy12.xls' },
  { name: 'Bookkeeping Monthly (XLS)', downloadLink: '/dummy13.xls' },
];

export function DocumentUpload({
  documents,
  setDocuments,
  additionalDocuments,
  setAdditionalDocuments,
}: DocumentUploadProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFileChange = (index: number, file: File) => {
    const newFiles = [...documents];
    newFiles[index] = file;
    setDocuments(newFiles);
  };

  const handleAdditionalFileChange = (newFiles: File[]) => {
    setAdditionalDocuments([...additionalDocuments, ...newFiles]);
  };

  const removeFile = (index: number, isAdditional = false) => {
    if (isAdditional) {
      const newFiles = [...additionalDocuments];
      newFiles.splice(index, 1);
      setAdditionalDocuments(newFiles);
    } else {
      const newFiles = [...documents];
      newFiles[index] = null;
      setDocuments(newFiles);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-red-800 mb-6">
        Required Documents
      </h2>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 bg-white rounded-lg shadow-lg"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              {documentNames[activeIndex].name}
            </h3>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href={documentNames[activeIndex].downloadLink}
                download
                className="flex items-center px-4 py-2 bg-[#C84B31] text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                <FaDownload className="mr-2" />
                <span>Download</span>
              </a>
              <label className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition duration-300">
                <FaUpload className="mr-2" />
                <span>Upload</span>
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileChange(activeIndex, e.target.files[0])
                  }
                  className="hidden"
                />
              </label>
            </div>
            {documents[activeIndex] && (
              <div className="mt-4 flex items-center">
                {getFileIcon(documents[activeIndex]!.name)}
                <span className="ml-2">{documents[activeIndex]!.name}</span>
                <button
                  onClick={() => removeFile(activeIndex)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute top-1/2 -translate-y-1/2 -left-4">
          <button
            onClick={() =>
              setActiveIndex(
                (prev) =>
                  (prev - 1 + documentNames.length) % documentNames.length
              )
            }
            className="p-2 bg-red-200 rounded-full hover:bg-red-300 transition duration-300"
          >
            &lt;
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4">
          <button
            onClick={() =>
              setActiveIndex((prev) => (prev + 1) % documentNames.length)
            }
            className="p-2 bg-red-200 rounded-full hover:bg-red-300 transition duration-300"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="flex justify-center space-x-2">
        {documentNames.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === activeIndex ? 'bg-[#C84B31]' : 'bg-gray-300'
            }`}
            whileHover={{ scale: 1.2 }}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-4 sm:p-6 bg-white rounded-lg shadow-lg"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Additional Documents
        </h3>
        <label className="flex items-center px-4 py-2 bg-[#C84B31] text-white rounded-md cursor-pointer hover:bg-red-700 transition duration-300">
          <FaUpload className="mr-2" />
          <span>Upload Additional Files</span>
          <input
            type="file"
            multiple
            onChange={(e) =>
              e.target.files &&
              handleAdditionalFileChange(Array.from(e.target.files))
            }
            className="hidden"
          />
        </label>
        {additionalDocuments.length > 0 && (
          <div className="mt-4 space-y-2">
            {additionalDocuments.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-2 bg-[#C84B31] rounded"
              >
                <div className="flex items-center">
                  {getFileIcon(file.name)}
                  <span className="ml-2">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index, true)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default DocumentUpload;
