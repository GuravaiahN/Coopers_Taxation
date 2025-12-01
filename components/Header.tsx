'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, Mail, User, LogOut } from 'lucide-react'
import { useAuth } from '../providers/auth-provider'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
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

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-gradient-to-r from-red-700 to-red-800 text-white py-3 px-4 text-sm fixed w-full top-0 z-50 font-bold shadow-lg border-b-2 border-red-900">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-red-100" />
              <span className="whitespace-nowrap tracking-wide">+1 (414) 446-7545</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-red-100" />
              <span className="whitespace-nowrap tracking-wide">info@cooperstaxation.com</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-red-100">Welcome, {user?.name}!</span>
                <Link
                  href={user?.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-all duration-200 text-sm font-semibold"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-900 hover:bg-red-800 px-3 py-1 rounded-full transition-all duration-200 text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-all duration-200 text-sm font-semibold"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-red-900 hover:bg-red-800 px-3 py-1 rounded-full transition-all duration-200 text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed w-full top-12 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-lg shadow' : 'bg-white shadow'
        }`}
        style={{ minHeight: 60 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/CT logo.svg"
                alt="Coopers Taxation"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              {navItems.map((item) => 
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-700 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-red-700 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href={user?.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-700 transition-colors duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-700 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <a
                  href="https://wa.me/14144467545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-700 text-white px-4 py-1 rounded-md hover:bg-red-800 font-semibold text-sm"
                >
                  Get Started
                </a>
              )}
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-2 border-t border-gray-200">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) =>
                  item.external ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-red-700 transition-colors duration-200 font-medium py-1 px-3 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-red-700 transition-colors duration-200 font-medium py-1 px-3 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
                {isAuthenticated ? (
                  <>
                    <Link
                      href={user?.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}
                      className="text-gray-700 hover:text-red-700 transition-colors duration-200 font-medium py-1 px-3 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="text-left text-gray-700 hover:text-red-700 transition-colors duration-200 font-medium py-1 px-3 rounded-lg hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-red-700 transition-colors duration-200 font-medium py-1 px-3 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-red-700 text-white px-3 py-2 rounded-lg hover:bg-red-800 font-semibold text-center mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}