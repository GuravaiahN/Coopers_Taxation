import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

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
        url: '/images/AboutUsHero.png',
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
        url: '/images/AboutUsHero.png',
        alt: "About Us - Cooper's Taxation Team",
      },
    ],
  },
  alternates: {
    canonical: 'https://www.cooperstaxation.com/about-us',
    languages: {
      'en-US': 'https://www.cooperstaxation.com/about-us',
    },
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
    <section className="bg-white py-6">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 bg-slate-100 rounded-lg">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0">
          <div className="relative w-full lg:w-1/2 h-64 sm:h-80 md:h-96">
            <Image
              src="/images/AboutUsHero.png"
              alt="About Cooper's Taxation"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-12">
            <h2 className="text-lg text-[#C84B31] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-poppins mb-4">
              Accessible, Approachable, Accountable
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-poppins">
              Cooper&apos;s Taxation brings over a decade of industry expertise,
              specializing in bookkeeping, taxation, and payroll services.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-lg  text-[#C84B31] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-poppins mb-4">
          Premium Taxation Services You Can Trust
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blck font-poppins max-w-4xl mx-auto">
          Providing expert financial services for non-resident Indians, H1B/L1
          visa holders, and F1 CPT/OPT students. Choose us for reliable and
          professional tax services.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 bg-[#f6dfdb] rounded-lg">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0">
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative w-full h-64 sm:h-80 md:h-96">
              <Image
                src="/images/TeamWorkingOnTax.png"
                alt="Team working on tax solutions"
                fill
                objectFit="cover"
                className="rounded-md object-right"
              />
            </div>
            <div className="relative w-full h-64 sm:h-80 md:h-96">
              <Image
                src="/images/TaxSign.png"
                alt="Signing important documents"
                fill
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 lg:pl-8">
            <h2 className="text-lg  text-[#C84B31] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-poppins mb-4">
              &ldquo;Quality Tax Filing Services for Your Financial
              Well-being&rdquo;
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-poppins mb-4">
              We offer premium tax filing services by experienced CPAs and EAs
              to ensure your financial peace.
            </p>
            <Link href="/contact-us">
              <button className="mt-4 px-6 py-3 bg-white text-black hover:text-[#C84B31] font-poppins rounded-lg hover:bg-[#f4bbae] transition-all">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="bg-gray-200 p-4 rounded-full inline-block">
              <span className="text-4xl">🤝</span>
            </div>
            <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-black font-poppins">
              We Remain True to Our Promises
            </p>
          </div>
          <div>
            <div className="bg-gray-200 p-4 rounded-full inline-block">
              <span className="text-4xl">💼</span>
            </div>
            <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-poppins">
              We Care for Your Welfare
            </p>
          </div>
          <div>
            <div className="bg-gray-200 p-4 rounded-full inline-block">
              <span className="text-4xl">⭐</span>
            </div>
            <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-poppins">
              We Ensure Your Satisfaction
            </p>
          </div>
          <div>
            <div className="bg-gray-200 p-4 rounded-full inline-block">
              <span className="text-4xl">🚀</span>
            </div>
            <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-poppins">
              Deliver Outstanding Results
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;