import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-red-400">Coopers Taxation</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Professional tax services for individuals and businesses. 
              Your trusted partner for expert tax preparation, planning, 
              and IRS representation services.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-400" />
                <span className="text-gray-300">+1 (414) 446-7545</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-400" />
                <span className="text-gray-300">info@cooperstaxation.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-400 mt-1" />
                <span className="text-gray-300">Milwaukee, Wisconsin</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services/individual-tax-prep" className="text-gray-300 hover:text-red-400 transition-colors">
                  Tax Preparation
                </Link>
              </li>
              <li>
                <Link href="/services/business-tax" className="text-gray-300 hover:text-red-400 transition-colors">
                  Business Services
                </Link>
              </li>
              <li>
                <Link href="/services/bookkeeping" className="text-gray-300 hover:text-red-400 transition-colors">
                  Bookkeeping
                </Link>
              </li>
              <li>
                <Link href="/services/irs-representation" className="text-gray-300 hover:text-red-400 transition-colors">
                  IRS Representation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-red-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-300 hover:text-red-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-red-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-gray-300 hover:text-red-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Coopers Taxation. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="tel:+14144467545" className="text-gray-400 hover:text-red-400 transition-colors text-sm">
                Call Us
              </a>
              <a href="mailto:info@cooperstaxation.com" className="text-gray-400 hover:text-red-400 transition-colors text-sm">
                Email Us
              </a>
              <a href="https://wa.me/14144467545" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors text-sm">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}