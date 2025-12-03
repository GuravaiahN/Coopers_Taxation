// app/components/ContactForm.tsx
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

const ContactForm: React.FC = () => {
  const { session } = useSessionStore();
  const { showToast, isVisible } = useToastStore();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user) {
      setFormData((prevData) => ({
        ...prevData,
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
      }));
    }
  }, [session]);

  const isValidUSPhoneNumber = (phone: string) => /^\d{10}$/.test(phone);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidUSPhoneNumber(formData.phone)) {
      showToast('Please enter a valid US phone number.', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.success) {
        showToast('Your message has been sent successfully!', 'success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        showToast(result.message || 'Something went wrong!', 'error');
      }
    } catch (error) {
      showToast('Failed to send message!', 'error');
    }

    setLoading(false);
  };

  return (
    <section className="bg-[#f9f7f7] py-14">
      <div className="container mx-auto px-4 gap-8 sm:px-6 md:px-12 flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 flex flex-col items-center text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#C84B31] font-poppins mb-4">
            Let&apos;s Get in Touch!
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-poppins mb-4">
            Have a question or need assistance? <br /> Reach out to us via
            email, phone, <br /> or the contact form below. <br /> We&apos;re
            eager to assist you.
          </p>
          <div className="w-full h-64 sm:h-80 md:h-96 relative">
            <Image
              src="/team3.jpg"
              alt="Person Working on Laptop"
              layout="fill"
              className="object-cover rounded-2xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={100}
              priority
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-gray-100 shadow-lg rounded-lg p-8 border-[#C84B31] border-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-[#C84B31] text-sm sm:text-base md:text-lg lg:text-xl mb-2 font-poppins"
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Your Name"
                className="w-full px-3 py-2 border rounded-lg text-gray-600 font-poppins focus:outline-none focus:border-[#C84B31]"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-[#C84B31] text-sm sm:text-base md:text-lg lg:text-xl mb-2 font-poppins"
                htmlFor="phone"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter Your Phone Number"
                className="w-full px-3 py-2 border rounded-lg text-gray-600 font-poppins focus:outline-none focus:border-[#C84B31]"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-[#C84B31] text-sm sm:text-base md:text-lg lg:text-xl mb-2 font-poppins"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Your Email"
                className="w-full px-3 py-2 border rounded-lg text-gray-600 font-poppins focus:outline-none focus:border-[#C84B31]"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-[#C84B31] text-sm sm:text-base md:text-lg lg:text-xl mb-2 font-poppins"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter Your Message"
                className="w-full px-3 py-2 border rounded-lg text-gray-600 font-poppins focus:outline-none focus:border-[#C84B31]"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 bg-[#C84B31] text-white rounded-lg transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#a84028]'
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <FaSpinner className="animate-spin" />
                  <span>Submitting...</span>
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>

      {isVisible && <Toast />}
    </section>
  );
};

export default ContactForm;
