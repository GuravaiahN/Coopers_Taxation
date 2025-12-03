'use client';

import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useSessionStore from '@/stores/useSessionStore';
import useToastStore from '@/stores/useToastStore';
import Toast from '../components/toast';
import { FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

const EyeIcon = () => (
  <svg
    className="h-5 w-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="h-5 w-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M17.94 17.94A10.978 10.978 0 012 12s4-7 11-7a10.978 10.978 0 015.04 1.34M1 1l22 22" />
  </svg>
);

export default function Login() {
  const router = useRouter();
  const { session, loading: sessionLoading, fetchSession } = useSessionStore();
  const { showToast, isVisible } = useToastStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // redirect if already logged in
  useEffect(() => {
    if (!sessionLoading && session) {
      router.replace('/');
    }
  }, [session, sessionLoading, router]);

  const isValidEmail = (email: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  // handle login submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const email = (e.currentTarget.email as HTMLInputElement).value;
    const password = (e.currentTarget.password as HTMLInputElement).value;

    if (!isValidEmail(email)) {
      showToast('Email is invalid', 'error');
      setLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        showToast(res.error, 'error');
      } else if (res?.ok) {
        showToast('Login successful!', 'success');

        // Force session refresh by resetting the store state first
        useSessionStore.setState({ isInitialized: false, session: null });
        await fetchSession();
        
        // Wait a bit for the session to be properly set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const user = useSessionStore.getState().session?.user;

        if (user) {
          if (user.role === 'admin' || user.isAdmin) {
            router.push('/admin/dashboard');
          } else {
            router.push('/user/dashboard');
          }
        } else {
          router.push('/');
        }
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f6] relative px-4">
      {isVisible && <Toast />}

      {/* Clean background pattern */}
      <div className="absolute inset-0 bg-[url('/pattern-light.svg')] opacity-5 pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl relative z-10 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-100">

        {/* Left: Illustration + Text */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#C84B31] mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Login to access your tax documents, uploads, and services.
          </p>

          <div className="relative w-full h-60 md:h-80">
            <Image
              src="/Login.png"
              alt="Login Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C84B31] focus:border-[#C84B31] outline-none"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C84B31] focus:border-[#C84B31] outline-none pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg bg-[#C84B31] text-white font-medium transition ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#a93a25]'
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <FaSpinner className="animate-spin" /> Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>

            {/* Links */}
            <div className="text-center">
              <Link
                className="text-[#C84B31] hover:text-[#a93a25] font-medium"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="text-center text-gray-700">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-[#C84B31] hover:text-[#a93a25] font-medium"
              >
                Register
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
