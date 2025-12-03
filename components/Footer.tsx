import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Footer - Cooper's Taxation",
  description:
    "Stay connected with Cooper's Taxation. Contact us via email, phone, or WhatsApp. Explore our services and policies.",
  robots: {
    index: false,
    follow: true,
  },
};

const Footer = () => {
  return (
    <footer className="bg-[#C84B31] text-white py-16 mt-16 relative overflow-hidden">

      {/* Decorative Background Shape */}
      <div className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/About.png')" }}
      />

      <div className="relative container mx-auto px-6 lg:px-12">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-poppins font-semibold mb-4">
              Cooper&apos;s Taxation
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed mb-6">
              Expert taxation, bookkeeping, and payroll services designed to
              support individuals and businesses with precision and trust.
            </p>

            {/* WhatsApp */}
            <a
              href="https://wa.me/14172542321?text=Hello%2C%20I%20need%20assistance%20with%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Chat"
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition-all"
            >
              <FaWhatsapp className="w-5 h-5 mr-2" />
              WhatsApp Chat
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-100">
              {[
                { name: 'Home', url: '/' },
                { name: 'About Us', url: '/about-us' },
                { name: 'Services', url: '/services' },
                { name: 'Pricing', url: '/pricing' },
                { name: 'Contact Us', url: '/contact-us' },
              ].map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    className="hover:text-gray-300 transition-all"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">
              Our Services
            </h4>
            <ul className="space-y-2 text-sm text-gray-100">
              {[
                { name: 'Tax Preparation', url: '/services/tax-preparation' },
                { name: 'Bookkeeping', url: '/services/bookkeeping' },
                { name: 'Payroll Services', url: '/services/payroll' },
                { name: 'ITIN Services', url: '/services/itin' },
                { name: 'Upload Documents', url: '/upload' },
              ].map((service) => (
                <li key={service.url}>
                  <Link
                    href={service.url}
                    className="hover:text-gray-300 transition-all"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">
              Contact Info
            </h4>
            <address className="not-italic text-sm space-y-3 text-gray-100">
              <p>
                <a
                  href="mailto:info@cooperstaxation.com"
                  className="hover:text-gray-300 transition-all"
                >
                  info@cooperstaxation.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+14172542321"
                  className="hover:text-gray-300 transition-all"
                >
                  +1 (417) 254-2321
                </a>
              </p>
              <p className="text-gray-200 leading-relaxed">
                Operating Hours: <br />
                Mon–Fri, 9 AM – 7 PM (CST)
              </p>
            </address>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-red-300 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Certifications */}
          <div className="flex items-center gap-8">
            <div className="w-24 h-12 relative">
              <Image src="/irs.svg" alt="IRS Certified" fill className="object-contain" />
            </div>

            <div className="w-24 h-12 relative">
              <Image src="/secure.svg" alt="Secure Payment" fill className="object-contain" />
            </div>
          </div>

          {/* Legal Section */}
          <div className="text-center md:text-right text-sm text-gray-100">
            <p className="mb-2">
              © {new Date().getFullYear()} Cooper&apos;s Taxation. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-gray-200">
              <Link href="/terms-and-conditions" className="hover:text-gray-300">
                Terms & Conditions
              </Link>
              <Link href="/privacy-policy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
              <Link href="/refund-estimate" className="hover:text-gray-300">
                Refund Policy
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
