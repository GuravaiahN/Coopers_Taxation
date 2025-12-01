import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Indian Tax Filing Services - Cooper's Taxation",
  description:
    "Simplify your Indian tax filing process with Cooper's Taxation. Expert services for U.S. residents and NRIs to meet their Indian tax obligations efficiently.",
  keywords: [
    'Indian tax filing',
    'NRI tax filing',
    'Indian taxes for U.S. residents',
    "Cooper's Taxation Indian tax services",
    'tax filing for NRIs',
    'Indian tax compliance',
    'Indian income tax return',
    'tax services for U.S.-based NRIs',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "Indian Tax Filing Services | Cooper's Taxation",
    description:
      "Need help with Indian tax filing? Cooper's Taxation offers expert assistance for U.S. residents and NRIs to meet their Indian tax obligations accurately.",
    url: 'https://www.cooperstaxation.com/services/us-individuals/indian-tax-filing',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/services-indian-tax-min.jpg',
        alt: "Indian Tax Filing Services - Cooper's Taxation",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Indian Tax Filing Services - Cooper's Taxation",
    description:
      "File your Indian taxes with ease. Cooper's Taxation provides professional services for U.S. residents and NRIs to handle their Indian tax obligations.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/services-indian-tax-min.jpg',
        alt: "Indian Tax Filing Services - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical:
      'https://www.cooperstaxation.com/services/us-individuals/indian-tax-filing',
    languages: {
      'en-US':
        'https://www.cooperstaxation.com/services/us-individuals/indian-tax-filing',
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

const IndianTaxFiling = () => {
  const backgroundColor = 'white';
  const textColor = 'text-black';
  const secondaryTextColor = 'text-gray-600';

  return (
    <div
      className={`bg-${backgroundColor} ${textColor} shadow-md flex relative`}
    >
      <div className="flex-1 overflow-y-auto relative">
        <div className="relative h-[500px]">
          {/* Image */}
          <Image
            src={'/services-indian-tax-min.jpg'}
            alt="Indian-Tax-Filing"
            className="absolute top-0 left-0 z-0 object-cover"
            quality={100}
            fill
            sizes="100vw"
            priority
          />

          <div className="flex justify-center items-center h-full w-full absolute top-0 left-0 font-poppins">
            <div className="bg-[#C84B31] p-5 mb-10 rounded-lg  text-white z-10 opacity-85">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl pb-2">
                INDIAN TAX FILING
              </h1>
              <h5 className="text-xs sm:text-sm text-white">
                Home / US-Individuals / Indian-Tax-Filing
              </h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between m-14 mr-10">
          <div className="flex-row flex-2 pr-8">
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              Indian Tax Filing
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              Our dedicated processing center in India is equipped to file
              Indian tax returns for clients living in the U.S. At the same
              time, we also serve our Indian clients who need to fulfill their
              tax obligations in India.
            </p>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              As per India&#39;s Income Tax laws, individuals are required to
              submit proof of their income return by the designated date,
              provided their total income exceeds the basic exemption limit. On
              the other hand, if an NRI is employed in India, their salary
              income will be taxed. Similarly, if an NRI works abroad but
              receives a salary in India, that amount will be included in their
              taxable income.
            </p>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              The Tax Adviser Hub understands the intricate nature and
              challenges of Indian tax filing. To ease this process, we provide
              a comprehensive range of services aimed at making your tax filing
              as seamless and stress-free as possible. Our experienced
              professionals are committed to offering high-quality service and
              expert advice, ensuring you approach your tax obligations with
              confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndianTaxFiling;
