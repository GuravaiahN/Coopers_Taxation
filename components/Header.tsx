'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, Mail } from 'lucide-react'
import useSessionStore from '../stores/useSessionStore'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const session = useSessionStore((state) => state.session)
  const loading = useSessionStore((state) => state.loading)
  const logout = useSessionStore((state) => state.logout)
  const router = useRouter()

  const isAuthenticated = !!session && !loading
  const user = session?.user

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Upload Documents', href: '/upload' },
    { name: 'Pricing', href: '/payment' },
    { name: 'Contact', href: 'https://wa.me/14144467545', external: true }
  ]

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white py-3 px-4 text-sm fixed w-full top-0 z-50 font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.25)]">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-red-100" />
              <span className="tracking-wide">+1 (414) 446-7545</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-red-100" />
              <span className="tracking-wide">info@cooperstaxation.com</span>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-red-100">Welcome, {user?.name}!</span>

                <Link
                  href={user?.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-all duration-200"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-900 hover:bg-red-800 px-3 py-1 rounded-full transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-all duration-200"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-red-900 hover:bg-red-800 px-3 py-1 rounded-full transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`fixed w-full top-12 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/70 backdrop-blur-md shadow-lg'
            : 'bg-white shadow'
        }`}
        style={{ minHeight: 70 }}
      >
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/Logo.png"
                alt="Cooper's Taxation"
                width={250}
                height={80}
                className="h-16 w-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex space-x-6">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-700 font-semibold tracking-wide transition-all duration-150"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-red-700 font-semibold tracking-wide transition-all duration-150"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center">
              <a
                href="https://wa.me/14144467545"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2 rounded-xl shadow-md shadow-red-900/30 font-bold text-sm tracking-wide"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Nav Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-2 border-t border-gray-200 animate-slideDown">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) =>
                  item.external ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-red-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-red-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-2 mt-4 pt-2 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-2">
                      <span className="text-gray-700 font-medium">Welcome, {user?.name}!</span>
                      <Link
                        href={user?.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-center transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/login"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-center transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-center transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>

                <a
                  href="https://wa.me/14144467545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-bold shadow-md text-center mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Animation */}
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </>
  )
}
