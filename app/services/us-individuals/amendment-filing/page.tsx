import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Amendment Filing Services - Cooper's Taxation",
  description:
    "Need to correct a filed tax return? Cooper's Taxation specializes in amendment filing to fix errors in filing status, credits, and deductions with accuracy.",
  keywords: [
    'amendment filing',
    'amended tax return',
    'correct tax filing',
    'filing status correction',
    'tax amendment services',
    "Cooper's Taxation amendment filing",
    'tax return correction',
    'tax services',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "Amendment Filing Services | Cooper's Taxation",
    description:
      "Fix errors in your tax filing with Cooper's Taxation. Our amendment filing services ensure accurate corrections for filing status, credits, and deductions.",
    url: 'https://www.cooperstaxation.com/services/us-individuals/amendment-filing',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/service10.jpg',
        alt: "Amendment Filing Services - Cooper's Taxation",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Amendment Filing Services - Cooper's Taxation",
    description:
      "Need to file an amended tax return? Cooper's Taxation provides expert services to correct errors in filing status, credits, and deductions.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/service10.jpg',
        alt: "Amendment Filing Services - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical:
      'https://www.cooperstaxation.com/services/us-individuals/amendment-filing',
    languages: {
      'en-US':
        'https://www.cooperstaxation.com/services/us-individuals/amendment-filing',
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

const AmendmentFilingComponent = () => {
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
            src={'/service10.jpg'}
            alt="Amendment-Filing"
            className="absolute top-0 left-0 z-0 object-cover"
            quality={100}
            fill
            sizes="100vw"
            priority
          />

          <div className="flex justify-center items-center h-full w-full absolute top-0 left-0">
            <div className="bg-[#C84B31] p-5 rounded-lg mb-10  text-white z-10 opacity-85">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl pb-2 font-poppins">
                Amendment Filing
              </h1>
              <h5 className="text-xs sm:text-sm text-white font-poppins">
                Home / US-Individuals / Amendment-Filing
              </h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between m-14 mr-10">
          <div className="flex-row flex-2 pr-8">
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              Amendment Filing
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              Should you notice an error after submitting your tax return,
              it&#39;s important to amend it as necessary. Often, the IRS will
              correct specific errors on your return and might process it even
              without certain schedules. In these instances, you don&#39;t need
              to take further action. However, if there are changes in your
              filing status, credits, or similar factors, filing an amended
              return is essential.
            </p>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              When seeking a refund, be sure to file Form 1040X within three
              years of your original tax filing or within two years of your tax
              payment. Don&#39;t forget, any return submitted before the
              deadline is officially regarded as filed on the due date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmendmentFilingComponent;
