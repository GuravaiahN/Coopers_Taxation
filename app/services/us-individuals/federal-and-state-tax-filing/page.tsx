import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Federal & State Tax Filing Services - Cooper's Taxation",
  description:
    "Get reliable and accurate federal and state tax filing services with Cooper's Taxation. We ensure compliance with IRS regulations for individuals and businesses.",
  keywords: [
    'federal tax filing',
    'state tax filing',
    'IRS tax services',
    'tax filing services',
    "Cooper's Taxation",
    'individual tax filing',
    'business tax compliance',
    'federal and state tax returns',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "Federal & State Tax Filing Services | Cooper's Taxation",
    description:
      "Cooper's Taxation offers expert federal and state tax filing services for individuals and businesses. Ensure accurate filings with IRS compliance.",
    url: 'https://www.cooperstaxation.com/services/us-individuals/federal-and-state-tax-filing',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/service8.jpg',
        alt: "Federal & State Tax Filing Services - Cooper's Taxation",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Federal & State Tax Filing Services - Cooper's Taxation",
    description:
      "Looking for professional tax filing services? Cooper's Taxation ensures accurate and reliable federal and state tax filings for individuals and businesses.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/service8.jpg',
        alt: "Federal & State Tax Filing Services - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical:
      'https://www.cooperstaxation.com/services/us-individuals/federal-and-state-tax-filing',
    languages: {
      'en-US':
        'https://www.cooperstaxation.com/services/us-individuals/federal-and-state-tax-filing',
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

const FederalStateTaxFiling = () => {
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
            src={'/service8.jpg'}
            alt=" Federal-and-State-Tax-Filing"
            className="absolute top-0 left-0 z-0 object-cover"
            quality={100}
            fill
            sizes="100vw"
            priority
          />

          <div className="flex justify-center items-center h-full w-full absolute top-0 left-0 font-poppins">
            <div className="bg-[#C84B31] p-5 mb-10 rounded-lg text-white z-10 opacity-85">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl pb-2 ">
                Federal And State Tax Filing
              </h1>
              <h5 className="text-xs sm:text-sm text-white">
                Home / US-Individuals / Federal-and-State-Tax-Filing
              </h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between m-14 mr-10">
          <div className="flex-row flex-2 pr-8">
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              Federal And State Tax Filing
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              You will be pleased to know that we are a dedicated and registered
              Electronic Return Originator with the IRS. We adhere strictly to
              the IRS&#39;s Circular 230 regulations, ensuring that our
              client&#39;s tax returns are prepared exclusively by CPAs, CAs,
              and professional tax preparers with MBA and EA degrees.
              Additionally, we assign significant roles to those who hold a PTIN
              for tax preparation.
            </p>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              Our approach to tax return preparation is always proactive, not
              reactive. We keep ourselves up-to-date with the latest tax
              regulations, ensuring we deliver exceptional services. Here are
              some of the tax filing services we provide to our clients.
            </p>

            <ul
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4 list-disc pl-5 space-y-2`}
            >
              <li>Assistance with W4</li>
              <li>Paper Filing</li>
              <li>Passport Certification Services</li>
              <li>ITIN or W7 application</li>
              <li>Filing amendment tax returns</li>
              <li>Extending the duration of tax returns</li>
              <li>Retirement arrangement of Individuals</li>
              <li>Filing FBAR AND FATCA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FederalStateTaxFiling;
