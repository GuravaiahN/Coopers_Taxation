// app/components/FileList.tsx
'use client';
import React from 'react';
import UserFiles from './UserFiles';
import AdminFiles from './AdminFiles';

interface FileListProps {
  isAdmin: boolean;
}

const FileList: React.FC<FileListProps> = ({ isAdmin }) => {
  if (isAdmin) {
    return <AdminFiles />;
  } else {
    return <UserFiles />;
  }
};

export default FileList;