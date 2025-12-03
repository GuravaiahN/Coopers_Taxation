'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import ServiceDropdown from './ServiceDropdown';
import Avatar from './avatar';
import useSessionStore from '../stores/useSessionStore'; // Zustand session store

const serviceLinks = [
  {
    title: 'US Individuals',
    subLinks: [
      {
        title: 'Federal And State Tax Filing',
        url: '/services/us-individuals/federal-and-state-tax-filing',
      },
      {
        title: 'FBAR/FATCA Processing',
        url: '/services/us-individuals/fbar-fatca-processing',
      },
      {
        title: 'ITIN Processing',
        url: '/services/us-individuals/itin-processing',
      },
      {
        title: 'Representation Services',
        url: '/services/us-individuals/representation-services',
      },
      {
        title: 'Amendment Filing',
        url: '/services/us-individuals/amendment-filing',
      },
      {
        title: 'Indian Tax Filing',
        url: '/services/us-individuals/indian-tax-filing',
      },
    ],
  },
  {
    title: 'US Business',
    subLinks: [
      {
        title: 'Entity Formation',
        url: '/services/us-business/entity-formation',
      },
      {
        title: 'Corporate Tax Filing',
        url: '/services/us-business/corporate-tax-filing',
      },
      {
        title: 'Limited Liability Company',
        url: '/services/us-business/limited-liability-company',
      },
    ],
  },
];

const Navbar = () => {
  const { session } = useSessionStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  // Toggle body overflow to prevent scrolling when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) setIsServiceDropdownOpen(false);
  };

  const toggleServiceDropdown = () => {
    setIsServiceDropdownOpen(!isServiceDropdownOpen);
  };

  // Click outside to close sidebar and dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMenuOpen &&
        target &&
        !target.closest('.sidebar') &&
        !target.closest('.hamburger-button')
      ) {
        setIsMenuOpen(false);
        setIsServiceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const otherLinks = [
    { id: 1, title: 'Home', url: '/' },
    { id: 2, title: 'About Us', url: '/about-us' },
    {
      id: 3,
      title: 'Services',
      dropdown: true,
    },
    { id: 4, title: 'Pricing', url: '/pricing' },
    { id: 5, title: 'Refund Estimate', url: '/refund-estimate' },
    {
      id: 6,
      title: 'Refund Status',
      url: '/refund-status',
      external: true,
    },
    { id: 7, title: 'Contact Us', url: '/contact-us' },
  ];

  return (
    <nav className="relative z-50 w-full bg-[#f6dfdb]">
      {/* Hamburger menu for xs, sm, md screens */}
      <div className="flex justify-around items-center w-full px-4 py-3 lg:hidden h-24 ">
        <Link href="/" className="flex">
          <Image
            src="/images/Logo.png"
            alt="Cooper's Taxation Logo"
            width={250}
            height={150}
            priority
            className="object-contain"
          />
        </Link>
        <button
          className="hamburger-button px-3 py-2 border rounded text-[#C84B31] border-[#C84B31] bg-[#ffffff]"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <span>&#10005;</span> : <span>&#9776;</span>}
        </button>
      </div>

      {/* Sidebar for xs, sm, md screens */}
      <div
        className={`fixed top-0 left-0 w-80 h-screen bg-[#f6dfdb] z-[60] p-6 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out shadow-lg overflow-y-auto sidebar`}
      >
        <div className="mt-4 flex flex-col space-y-4">
          {otherLinks.map((link) => (
            <div key={link.id} className="flex flex-col">
              {link.dropdown ? (
                <>
                  <button
                    onClick={toggleServiceDropdown}
                    className="flex justify-between items-center text-lg  text-[#C84B31]"
                  >
                    {link.title}
                    <span>{isServiceDropdownOpen ? '▲' : '▼'}</span>
                  </button>
                  {isServiceDropdownOpen && (
                    <div className="pl-4 mt-2 max-h-[60vh] overflow-y-auto">
                      {serviceLinks.map((service) => (
                        <div key={service.title} className="mt-2">
                          <div className=" text-[#C84B31]">{service.title}</div>
                          <div className="pl-4 text-left">
                            {service.subLinks.map((subLink) => (
                              <Link
                                key={subLink.title}
                                href={subLink.url}
                                className="block text-[#1E2A5E] hover:bg-[#C84B31] hover:text-[#f6dfdb] rounded-md  transition-colors duration-200 py-1 pl-3"
                                onClick={toggleMenu}
                              >
                                {subLink.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.url || '#'}
                  className="block text-lg  text-[#C84B31] hover:underline"
                  onClick={toggleMenu}
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
          {session ? (
            <div className="mt-4 flex items-center space-x-2">
              <Avatar />
              <button
                onClick={() =>
                  signOut({ callbackUrl: 'https://cooperstaxation.com' })
                }
                className=" text-lg text-[#C84B31] hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col space-y-1">
              <Link
                href="/register"
                className=" text-lg mb-2 text-[#C84B31] hover:underline cursor-pointer"
                onClick={toggleMenu}
              >
                Register
              </Link>
              <Link
                href="/login"
                className=" text-lg text-[#C84B31] hover:underline cursor-pointer"
                onClick={toggleMenu}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navbar for lg and xl screens */}
      <div className="hidden lg:flex justify-evenly items-center px-6 py-2 bg-[#f6dfdb] border-b-2 border-gray-300 shadow-md">
        <div className="flex space-x-6">
          {otherLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center text-md  text-black hover:underline"
            >
              {link.dropdown ? (
                <ServiceDropdown />
              ) : (
                <Link
                  href={link.url || '#'}
                  className="text-black text-md hover:underline font-poppins"
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
        </div>
        {session ? (
          <div className="flex items-center space-x-2">
            <Avatar />
            <button
              onClick={() =>
                signOut({ callbackUrl: 'https://cooperstaxation.com' })
              }
              className="font-poppins text-md hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              href="/register"
              className="font-poppins text-md text-black hover:underline"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="font-poppins text-md text-black hover:underline"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
