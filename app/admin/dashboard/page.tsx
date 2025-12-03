'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminDashboard from '../../components/AdminDashboard';

const AdminDashboardPage = () => {
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C84B31]"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return <AdminDashboard />;
};

export default AdminDashboardPage;