'use client';

import React, { useEffect, useState } from 'react';
import useSessionStore from '@/stores/useSessionStore';
import useToastStore from '@/stores/useToastStore';
import Toast from './toast';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const { session } = useSessionStore();
  const { showToast, isVisible } = useToastStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        phone: session.user.phone ?? '',
        message: '',
      });
    }
  }, [session]);

  const isValidUSPhoneNumber = (phone: string) =>
    /^\d{10}$/.test(phone.replace(/\D/g, ''));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidUSPhoneNumber(formData.phone)) {
      showToast('Enter a valid 10-digit US phone number', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        showToast('Message sent successfully!', 'success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        showToast(data.message || 'Something went wrong', 'error');
      }
    } catch {
      showToast('Failed to send message', 'error');
    }

    setLoading(false);
  };

  return (
    <section className="bg-[#fafafa] py-16 relative">
      {isVisible && <Toast />}

      <div className="container mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12">

        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#C84B31] mb-4">
            Let’s Get in Touch
          </h2>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            Have questions about taxation, filings, or our services?  
            Reach out through the form — we’re here to help.
          </p>

          <div className="relative w-full h-72 sm:h-80 md:h-96">
            <Image
              src="/LaptopPerson.png"
              alt="Person Working on Laptop"
              fill
              className="object-contain rounded-xl"
              priority
            />
          </div>
        </div>

        {/* RIGHT SECTION (FORM) */}
        <div className="w-full lg:w-1/2 bg-white border border-gray-200 shadow-xl rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#C84B31] focus:border-[#C84B31] outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit US number"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#C84B31] focus:border-[#C84B31] outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#C84B31] focus:border-[#C84B31] outline-none"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#C84B31] focus:border-[#C84B31] outline-none min-h-[120px]"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#C84B31] text-white font-medium rounded-lg transition ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#a84028]'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
