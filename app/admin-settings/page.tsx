'use client';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Tabs from '../components/tabs';

const AdminSettings = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/login');
      return;
    }
    if (session.user.role !== 'admin' && !session.user.isAdmin) {
      router.push('/user/dashboard');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl sm:text-4xl text-[#C84B31] mb-6 font-poppins">
          Admin Dashboard
        </h1>
        <Tabs isAdmin={true} />
      </div>
    </div>
  );
};

export default AdminSettings;