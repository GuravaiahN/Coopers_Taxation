'use client';
import React, { useEffect, useState } from 'react';

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const ContactFormData: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/contact-data');
      const data = await response.json();

      if (data.success) {
        setContacts(data.contacts || []);
      } else {
        setError(data.message || 'Failed to fetch contact data');
        setContacts([]);
      }
    } catch (err) {
      setError('An error occurred while fetching contact data');
      setContacts([]);
      console.error('Error fetching contact data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C84B31]"></div>
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

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center text-gray-500 p-6">
        <p className="font-poppins">No contact messages found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-poppins text-[#C84B31] mb-4">Contact Form Submissions</h2>
      
      <div className="grid gap-4">
        {contacts.map((contact) => (
          <div key={contact._id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-poppins text-gray-800 font-semibold">
                  {contact.fullName}
                </h3>
                <p className="text-sm text-gray-600 font-poppins">{contact.email}</p>
              </div>
              <span className="text-xs text-gray-500 font-poppins">
                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="mb-3">
              <h4 className="text-md font-poppins text-gray-700 font-medium mb-1">Subject:</h4>
              <p className="text-sm font-poppins text-gray-800">{contact.subject}</p>
            </div>
            
            <div>
              <h4 className="text-md font-poppins text-gray-700 font-medium mb-1">Message:</h4>
              <p className="text-sm font-poppins text-gray-800 leading-relaxed">
                {contact.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactFormData;