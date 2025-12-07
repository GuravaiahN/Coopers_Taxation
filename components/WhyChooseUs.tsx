'use client';

import { useState } from 'react';
import {
  FaShieldAlt,
  FaClock,
  FaChartLine,
  FaFileInvoiceDollar,
  FaUserShield,
  FaHistory,
  FaHeadset,
  FaFileContract,
} from 'react-icons/fa';
import { COMPANY_STATS } from '../lib/constants';

type Benefit = {
  icon: React.ElementType;
  title: string;
  description: string;
};

type BenefitCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export default function TaxBenefits() {
  const benefitsData: Benefit[] = [
    {
      icon: FaShieldAlt,
      title: 'Error-Free Filing',
      description:
        'Advanced verification systems ensure 100% accuracy in your tax returns',
    },
    {
      icon: FaClock,
      title: '24/7 Support',
      description:
        'Round-the-clock expert assistance for all your tax-related queries',
    },
    {
      icon: FaChartLine,
      title: 'Quick Estimates',
      description:
        'Receive precise tax estimates within 24 hours of document submission',
    },
    {
      icon: FaFileInvoiceDollar,
      title: 'Smart Filing',
      description:
        'Streamlined process with intelligent automation for faster returns',
    },
    {
      icon: FaUserShield,
      title: 'Data Protection',
      description:
        'Bank-grade encryption ensuring complete confidentiality of your information',
    },
    {
      icon: FaHistory,
      title: 'Historical Analysis',
      description:
        'Comprehensive review of past returns to maximize future benefits',
    },
    {
      icon: FaHeadset,
      title: 'Premium Service',
      description: 'High-quality tax solutions at competitive market rates',
    },
    {
      icon: FaFileContract,
      title: 'Form Assistance',
      description: 'Expert guidance for all tax forms including W4 and W7',
    },
  ];

  const BenefitCard = ({
    icon: Icon,
    title,
    description,
  }: BenefitCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="group relative p-6 rounded-2xl transition-all duration-500 backdrop-blur-lg  border h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ffffff] to-transparent opacity-25 " />

        {/* Icon with Hover Animation */}
        <div className="relative mb-6">
          <div className="w-12 h-12 flex items-center justify-center">
            <div
              className={`absolute inset-0 bg-[#C84B31] rounded-xl transform transition-all duration-300 ${
                isHovered ? 'scale-125' : 'rotate-0'
              }`}
            />
            <Icon
              className={`relative z-10 w-6 h-6 text-white transform transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-[#ff6b4a] mb-3 group-hover:text-[#ff6b4a] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-black leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
      </div>
    );
  };

  return (
    <section className="relative min-h-screen pb-10 overflow-hidden text-white bg-[#f6dfdb]">
      <div className="container relative z-10 mx-auto px-4">
        {/* Company Stats */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#C84B31] mb-8">
            Why Choose Cooper&apos;s Taxation?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-red-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl md:text-6xl font-bold text-[#C84B31] mb-3">
                {COMPANY_STATS.happyClients}
              </div>
              <div className="text-xl font-semibold text-gray-800 mb-2">
                Happy Clients
              </div>
              <div className="text-gray-600">
                Trusted by thousands worldwide for reliable tax services
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-red-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl md:text-6xl font-bold text-[#C84B31] mb-3">
                {COMPANY_STATS.yearsOfExperience}
              </div>
              <div className="text-xl font-semibold text-gray-800 mb-2">
                Years of Experience
              </div>
              <div className="text-gray-600">
                Proven expertise and professional guidance since 2016
              </div>
            </div>
          </div>
        </div>

        <h1
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl pt-12  text-center mb-4 font-poppins
        text-[#C84B31]"
        >
          Maximize Your Tax Benefits
        </h1>
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center text-black pb-12 font-poppins max-w-3xl mx-auto">
          Experience unparalleled tax services designed to maximize your returns
          and minimize your stress
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {benefitsData.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
