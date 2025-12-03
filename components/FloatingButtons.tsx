'use client';
import React from 'react';
import { FaUserAlt, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

const FloatingButtons = () => {
  const buttonBaseClass =
    'flex items-center bg-gradient-to-b from-[#f9f7f7] to-[#f6dfdb] border border-[#C84B31] px-4 py-2 rounded-full transition-all duration-300 ease-in-out';

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-end space-y-2 z-50">
      {/* Refer a Friend Button */}
      <Link href="/refer-and-earn">
        <div
          className={`${buttonBaseClass} hover:w-48 group flex items-center justify-center w-12 h-12`}
        >
          <FaUserAlt className="text-2xl text-[#C84B31]" />
          <span className="ml-3 opacity-0 group-hover:opacity-100 group-hover:inline-block hidden transition-opacity duration-300 font-poppins whitespace-nowrap">
            Refer And Earn
          </span>
        </div>
      </Link>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/14144467545?text=Hello%2C%20I%20need%20assistance%20with%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className={`${buttonBaseClass} hover:w-48 group flex items-center justify-center w-12 h-12`}
        >
          <FaWhatsapp className="text-2xl text-green-600" />
          <span className="ml-3 opacity-0 group-hover:opacity-100 group-hover:inline-block hidden transition-opacity duration-300 font-poppins whitespace-nowrap">
            WhatsApp
          </span>
        </div>
      </a>
    </div>
  );
};

export default FloatingButtons;