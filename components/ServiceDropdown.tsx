import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaUser, FaBusinessTime } from 'react-icons/fa';

const ServiceDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const serviceLinks = [
    {
      title: 'US Individuals',
      icon: <FaUser className="text-black w-5 h-5" />,
      subLinks: [
        {
          title: 'Federal & State Tax Filing',
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
      icon: <FaBusinessTime className="text-black w-5 h-5" />,
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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const toggleSubmenu = (title: string) =>
    setActiveSubmenu(activeSubmenu === title ? null : title);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
      setActiveSubmenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="cursor-pointer font-poppins text-md flex items-center text-black"
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        Services
        <svg
          className="ml-2 h-4 w-4 transition-transform"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <div
          className="absolute left-0 mt-2 w-48 bg-[#f6dfdb] text-black rounded-md text-md font-poppins shadow-lg transition-all duration-300 ease-in-out"
          role="menu"
          aria-label="Service Options"
        >
          <ul className="py-1">
            {serviceLinks.map((service, index) => (
              <li key={service.title} className="relative">
                <div
                  className="flex items-center font-poppins justify-between px-4 py-2 cursor-pointer"
                  onClick={() => toggleSubmenu(service.title)}
                  aria-expanded={activeSubmenu === service.title}
                  aria-controls={`${service.title}-submenu`}
                >
                  {service.title}
                  <svg
                    className="ml-2 h-3 w-3 text-black"
                    viewBox="0 0 6 10"
                    fill="none"
                  >
                    <path
                      d="M1 1L5 5L1 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {activeSubmenu === service.title && (
                  <div
                    className="absolute top-0 left-full mt-0 ml-0 w-56 bg-[#f6dfdb] rounded-md shadow-lg z-10 p-5 transition-all duration-300 ease-in-out"
                    role="menu"
                    aria-labelledby={service.title}
                    id={`${service.title}-submenu`}
                  >
                    <ul className="py-1">
                      {service.subLinks.map((subLink, subIndex) => (
                        <li key={subLink.title}>
                          <Link
                            href={subLink.url}
                            className="block text-black hover:bg-[#C84B31] hover:text-[#f6dfdb] rounded-md font-montserrat transition-colors duration-200 py-2 pl-3"
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setActiveSubmenu(null);
                            }}
                          >
                            {subLink.title}
                          </Link>
                          {subIndex < service.subLinks.length - 1 && (
                            <div className="border-b border-black mx-3 "></div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {index < serviceLinks.length - 1 && (
                  <div className="border-b border-black mx-4"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServiceDropdown;
