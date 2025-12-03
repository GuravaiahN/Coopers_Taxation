import Image from 'next/image';
import { Metadata } from 'next';
import {
  FaAccessibleIcon,
  FaHandsHelping,
  FaCheckCircle,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: "About Us - Cooper's Taxation",
  description:
    "Discover Cooper's Taxation, a team of experienced professionals dedicated to providing top-quality tax, bookkeeping, and payroll services tailored to your needs.",
  keywords: [
    "about Cooper's Taxation",
    'tax services team',
    'bookkeeping experts',
    'payroll professionals',
    "Cooper's Taxation about us",
    'experienced tax consultants',
    'professional tax services',
    'trusted tax advisors',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "About Us | Cooper's Taxation",
    description:
      "Learn about Cooper's Taxation, a trusted team of professionals offering expert tax, bookkeeping, and payroll services. Meet the team behind our success.",
    url: 'https://www.cooperstaxation.com/about-us',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: '/About.png',
        alt: "About Us - Cooper's Taxation Team",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Us - Cooper's Taxation",
    description:
      "Get to know the experienced team behind Cooper's Taxation. Providing top-quality tax, bookkeeping, and payroll services tailored to meet your needs.",
    images: [
      {
        url: '/About.png',
        alt: "About Us - Cooper's Taxation Team",
      },
    ],
  },
  alternates: {
    canonical: 'https://www.cooperstaxation.com/about-us',
    languages: { 'en-US': 'https://www.cooperstaxation.com/about-us' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
};

const AboutUs = () => {
  return (
    <div className="bg-[#fff6f4] py-16 px-4 md:px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-12">

        {/* Left Illustration */}
        <div className="w-full sm:w-3/5 md:w-1/2 relative h-[260px] sm:h-[300px] md:h-[380px] rounded-xl overflow-hidden shadow-xl">
          <Image
            src="/About.png"
            alt="About Cooper's Taxation"
            fill
            className="absolute object-contain rounded-xl"
            quality={100}
            priority
          />
        </div>

        {/* Right Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#C84B31] tracking-tight leading-snug mb-6 font-poppins">
            Empowering You with Trusted<br />Financial Guidance
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed font-poppins">
            Cooper&apos;s Taxation brings together a highly experienced team with
            over a decade of expertise in bookkeeping, taxation, and payroll
            management. Our clients trust us for our consistency,
            confidentiality, and commitment to accurate financial results.
          </p>
        </div>
      </div>

      {/* Highlight Section */}
      <div className="mt-16 bg-gradient-to-r from-[#C84B31] to-[#9f3b24] py-12 rounded-xl shadow-xl max-w-7xl mx-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-6">

          {/* Card 1 */}
          <div className="flex flex-col items-center bg-white text-[#C84B31] px-8 py-10 rounded-xl shadow-lg w-full md:w-1/3 hover:shadow-2xl transition-all duration-300">
            <FaAccessibleIcon className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Accessible</h3>
            <p className="text-center text-gray-700 text-md">
              Our services are built to be simple, clear,
              and convenient for every client.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center bg-white text-[#C84B31] px-8 py-10 rounded-xl shadow-lg w-full md:w-1/3 hover:shadow-2xl transition-all duration-300">
            <FaHandsHelping className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Approachable</h3>
            <p className="text-center text-gray-700 text-md">
              We maintain a friendly and supportive approach
              so you feel confident and heard.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center bg-white text-[#C84B31] px-8 py-10 rounded-xl shadow-lg w-full md:w-1/3 hover:shadow-2xl transition-all duration-300">
            <FaCheckCircle className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Accountable</h3>
            <p className="text-center text-gray-700 text-md">
              We stand by our work with full responsibility,
              ensuring accurate and reliable results.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
