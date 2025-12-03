'use client';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-[#C84B31] to-[#a84028] text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
          Welcome to Coopers
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl font-poppins mb-8 opacity-90 max-w-3xl mx-auto">
          Your trusted partner for comprehensive tax and financial services. 
          We help you maximize your refunds and streamline your financial processes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-[#C84B31] px-8 py-4 rounded-lg font-poppins font-semibold hover:bg-gray-100 transition-colors">
            Get Started
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-poppins font-semibold hover:bg-white hover:text-[#C84B31] transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;