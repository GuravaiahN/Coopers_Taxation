import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ITIN Processing Services - Cooper's Taxation",
  description:
    "Apply for your Individual Taxpayer Identification Number (ITIN) with Cooper's Taxation. Expert assistance to fulfill your tax obligations smoothly.",
  keywords: [
    'ITIN processing',
    'apply for ITIN',
    'Individual Taxpayer Identification Number',
    "Cooper's Taxation ITIN services",
    'tax ID for individuals',
    'ITIN application help',
    'tax services for non-residents',
    'ITIN number filing',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "ITIN Processing Services | Cooper's Taxation",
    description:
      "Simplify the ITIN application process with Cooper's Taxation. Our experts help you obtain your Individual Taxpayer Identification Number (ITIN) with ease.",
    url: 'https://www.cooperstaxation.com/services/us-individuals/itin-processing',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/Services-ITIN-min.jpg',
        alt: "ITIN Processing Services - Cooper's Taxation",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ITIN Processing Services - Cooper's Taxation",
    description:
      "Looking for ITIN processing help? Cooper's Taxation provides expert guidance to apply for and obtain your Individual Taxpayer Identification Number.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/Services-ITIN-min.jpg',
        alt: "ITIN Processing Services - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical:
      'https://www.cooperstaxation.com/services/us-individuals/itin-processing',
    languages: {
      'en-US':
        'https://www.cooperstaxation.com/services/us-individuals/itin-processing',
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

export const dynamic = 'force-static';

const ItinProcessing = () => {
  const backgroundColor = 'white';
  const textColor = 'text-black';
  const secondaryTextColor = 'text-gray-800';

  return (
    <div
      className={`bg-${backgroundColor} ${textColor} shadow-md flex relative`}
    >
      <div className="flex-1 overflow-y-auto relative">
        <div className="relative h-[500px]">
          {/* Image */}
          <Image
            src={'/Services-ITIN-min.jpg'}
            alt="Itin-Processing"
            className="absolute top-0 left-0 z-0 object-cover"
            quality={100}
            fill
            sizes="100vw"
            priority
          />

          <div className="flex justify-center items-center h-full w-full absolute top-0 left-0">
            <div className="bg-[#C84B31] p-5 rounded-lg font-poppins mb-10 text-white z-10 text-center opacity-85">
              <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
                ITIN Processing
              </h1>
              <h5 className="text-xs sm:text-sm text-white font-poppins">
                Home / US-Individuals / Itin-Processing
              </h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between m-14 mr-10">
          <div className="flex-row flex-2 pr-8">
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4  font-poppins">
              ITIN Processing
            </h1>
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              What are the Situations under which a non-US Person Requires ITIN?
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              Well, this is one of the most commonly asked questions from our
              clients. So here are some important things about ITIN we feel you
              need to be aware of.
            </p>
            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              The acronym ITIN represents the Individual Taxpayer Identification
              Number. Unlike the Employee Identification Number (EIN), which is
              used for company tax filings, the ITIN is designated solely for
              individuals and serves as an equivalent to the SSN. Residents of
              the U.S. need an SSN to gain access to employment opportunities.
            </p>
            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              Frankly speaking, an ITIN is meant for individuals who require a
              U.S. taxpayer ID. Here are some situations where an ITIN is
              needed.
            </p>

            <ul
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4 list-disc pl-5 space-y-1`}
            >
              <li>You are required to file a tax return</li>
              <li>You are a business owner or process credit card payments</li>
              <li>
                You are a dependent child or spouse who is not a U.S. citizen
              </li>
              <li>You have a U.S. tax filing obligation</li>
              <li>
                You own a U.S.-based business or have income effectively
                connected to the U.S.
              </li>
            </ul>
            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              Keep in mind that the ITIN application process is not simple. For
              any questions or assistance, please contact us at your earliest
              convenience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItinProcessing;
