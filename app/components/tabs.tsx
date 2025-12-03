'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProfileSettings from './profileSettings';
import FileList from './fileList';
import ContactFormData from './ContactFormData';
import RegisteredUsersData from './RegisteredUsersData'; // New component for registered users

const Tabs = ({ isAdmin }: { isAdmin: boolean }) => {
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex space-x-4 mb-6 border-b-2 border-gray-300 overflow-x-auto">
        {/* Profile Settings Tab */}
        <button
          className={`pb-2 text-lg font-poppins ${
            activeTab === 0
              ? 'border-b-4 border-[#C84B31] text-[#C84B31]'
              : 'text-gray-800 hover:text-[#C84B31] transition-colors duration-300'
          }`}
          onClick={() => setActiveTab(0)}
        >
          Profile Settings
        </button>

        {/* File List Tab */}
        <button
          className={`pb-2 text-lg font-poppins ${
            activeTab === 1
              ? 'border-b-4 border-[#C84B31] text-[#C84B31]'
              : 'text-gray-800 hover:text-[#C84B31] transition-colors duration-300'
          }`}
          onClick={() => setActiveTab(1)}
        >
          {isAdmin ? 'Total Client File Records' : 'Your Uploaded Files'}
        </button>

        {/* Contact Inquiries Tab for Admin */}
        {
          <button
            className={`pb-2 text-lg font-poppins ${
              activeTab === 2
                ? 'border-b-4 border-[#C84B31] text-[#C84B31]'
                : 'text-gray-800 hover:text-[#C84B31] transition-colors duration-300'
            }`}
            onClick={() => setActiveTab(2)}
          >
            US Inquiries
          </button>
        }

        {/* Registered Users Tab for Admin */}
        {isAdmin && (
          <button
            className={`pb-2 text-lg font-poppins ${
              activeTab === 3
                ? 'border-b-4 border-[#C84B31] text-[#C84B31]'
                : 'text-gray-800 hover:text-[#C84B31] transition-colors duration-300'
            }`}
            onClick={() => setActiveTab(3)}
          >
            Total Registered Clients
          </button>
        )}
      </div>

      <div ref={contentRef}>
        {activeTab === 0 && <ProfileSettings />}
        {activeTab === 1 && <FileList isAdmin={isAdmin} />}
        {activeTab === 2 && <ContactFormData isAdmin={isAdmin} />}
        {isAdmin && activeTab === 3 && (
          <RegisteredUsersData isAdmin={isAdmin} />
        )}
        {/* New Tab */}
      </div>
    </div>
  );
};

export default Tabs;