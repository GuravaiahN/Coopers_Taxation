'use client';
import React from 'react';
import useSessionStore from '@/stores/useSessionStore';
import Tabs from '../components/tabs';

const UserSettings = () => {
  const { session, loading } = useSessionStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-poppins">
          Loading...
        </p>
      </div>
    );
  }

  if (session?.user?.isAdmin) {
    return <p>Redirecting to Admin Dashboard...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl sm:text-4xl font-poppins text-[#C84B31] mb-6">
          User Settings
        </h1>
        <Tabs isAdmin={false} />
      </div>
    </div>
  );
};

export default UserSettings;