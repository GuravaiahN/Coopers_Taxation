'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const phrases = [
  'Maximize Your Refund',
  'Simplify Your Taxes',
  'Secure Your Future',
  'Optimize Your Finances',
];

export function HeroSection() {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[380px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#C84B31] to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16 lg:px-24">
        <h1 className="text-3xl mb-4 mt-4 text-black text-center">
          <span className="block">Smart Tax Solutions</span>
          <span
            key={currentPhrase}
            className="block text-[#C84B31] transition-opacity duration-500"
          >
            {phrases[currentPhrase]}
          </span>
        </h1>
        <p className="text-xl mb-8 text-black max-w-2xl text-center">
          Experience a revolutionary approach to tax refunds. Our team of
          experienced professionals ensures you get the maximum refund possible,
          hassle-free.
        </p>
        <button className="px-8 py-3 bg-[#C84B31] text-white rounded-full font-semibold text-lg shadow-lg hover:bg-red-500 transition duration-300">
          Start Your Smart Estimate
        </button>
      </div>
    </div>
  );
}
