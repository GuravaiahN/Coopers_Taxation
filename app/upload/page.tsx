'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DocumentUpload from '../../components/DocumentUpload-new';
import { Lock, LogIn } from 'lucide-react';

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // Still loading session
    
    setIsLoading(false);
    
    if (status === 'unauthenticated') {
      // Redirect to login page if not authenticated
      router.push('/login?redirect=/upload');
    }
  }, [status, router]);

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C84B31] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to upload documents securely. Please sign in to continue.
            </p>
            <button
              onClick={() => router.push('/login?redirect=/upload')}
              className="bg-[#C84B31] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2 w-full"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In to Upload</span>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-[#C84B31] hover:underline font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DocumentUpload />
    </div>
  );
}