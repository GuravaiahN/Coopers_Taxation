'use client';

import { useEffect, ReactNode, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useSessionStore from '../stores/useSessionStore';

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const isInitialized = useSessionStore((state) => state.isInitialized);
  const fetchSessionFn = useSessionStore((state) => state.fetchSession);
  
  const fetchSession = useCallback(() => {
    if (!isInitialized) {
      fetchSessionFn();
    }
  }, [isInitialized, fetchSessionFn]);

  // Fetch session only once on initial render
  useEffect(() => {
    fetchSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}