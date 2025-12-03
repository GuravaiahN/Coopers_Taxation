import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "404 - Page Not Found | Cooper's Taxation",
  description:
    'The page you are looking for could not be found. Please return to the homepage or explore our services for expert tax and financial solutions.',
  openGraph: {
    title: "404 - Page Not Found | Cooper's Taxation",
    description:
      "Sorry, the page you are looking for is not available. Visit Cooper's Taxation homepage for reliable tax and financial services.",
    url: '/images/NotFound.png',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: '/images/NotFound.png',
        alt: "Page Not Found - Cooper's Taxation",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "404 - Page Not Found | Cooper's Taxation",
    description:
      "Sorry, the page you are looking for is not available. Explore Cooper's Taxation services for expert tax and financial solutions.",
    images: [
      {
        url: '/images/NotFound.png',
        alt: "Page Not Found - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical: 'https://www.cooperstaxation.com/not-found',
  },
  robots: {
    index: false,
    follow: true,
  },
};

const NotFound = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center bg-white text-[#1E2A5E] px-4 py-8">
      <div className="w-full sm:w-1/2 text-center mb-8 sm:mb-0 lg:pl-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#C84B31] to-[#FF8360] mb-4 font-playfair">
          Oops!
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-600 font-montserrat font-bold">
          We can&apos;t seem to find the page you&apos;re looking for.
        </p>
        <Link href="/">
          <button className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-[#C84B31] text-white text-base sm:text-lg font-semibold rounded-full shadow-lg hover:bg-[#FF8360] transition-transform transform hover:scale-105 duration-300 font-serif">
            Go Back Home
          </button>
        </Link>
      </div>
      <div className="w-full sm:w-1/2 text-center">
        <Image
          src="/images/NotFound.png"
          alt="Page Not Found - 404 Error"
          width={400}
          height={300}
          className="mx-auto sm:w-64 sm:h-48 md:w-80 md:h-60 lg:w-96 lg:h-72"
        />
      </div>
    </div>
  );
};

export default NotFound;