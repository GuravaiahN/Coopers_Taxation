import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Corporate Tax Filing Services - Cooper's Taxation",
  description:
    'Expert assistance with corporate tax filing for sole proprietorships, partnerships, corporations, and S-corporations. Maximize tax benefits and ensure compliance with our trusted services.',
  keywords: [
    'corporate tax filing',
    'business tax filing',
    'tax filing for corporations',
    'sole proprietorship tax filing',
    'S-corporations tax filing',
    'partnership tax services',
    'tax consultants',
    'corporate tax compliance',
    "Cooper's Taxation services",
    'small business tax solutions',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "Corporate Tax Filing Services | Cooper's Taxation",
    description:
      'Specialized corporate tax filing services for sole proprietorships, partnerships, and corporations. Ensure accuracy and compliance with expert CPAs.',
    url: 'https://www.cooperstaxation.com/services/us-business/corporate-tax-filing',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/service13.jpg',
        alt: 'Corporate Tax Filing',
      },
      {
        url: 'https://www.cooperstaxation.com/service13.jpg',
        alt: 'Our Expert Taxation Team',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Corporate Tax Filing Services - Cooper's Taxation",
    description:
      "Looking for reliable corporate tax filing services? Cooper's Taxation offers expert solutions for businesses of all sizes. Contact us today!",
    images: [
      {
        url: 'https://www.cooperstaxation.com/service13.jpg',
        alt: 'Corporate Tax Filing',
      },
    ],
  },
  alternates: {
    canonical:
      'https://www.cooperstaxation.com/services/us-business/corporate-tax-filing',
    languages: {
      'en-US':
        'https://www.cooperstaxation.com/services/us-business/corporate-tax-filing',
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

const CorporateTaxFiling = () => {
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
            src={'/services-corporate-tax-min.jpg'}
            alt="Corporate-Tax-Filing"
            className="absolute top-0 left-0 z-0 object-cover"
            quality={100}
            fill
            sizes="100vw"
            priority
          />

          <div className="flex justify-center items-center h-full w-full absolute top-0 left-0">
            <div className="bg-[#C84B31] p-5 rounded-lg font-poppins mb-10  text-white z-10 opacity-85">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl pb-2 font-poppins">
                Corporate Tax Filing
              </h1>
              <h5 className="text-xs sm:text-sm text-white font-poppins">
                Home / US-Individuals / Corporate-Tax-Filing
              </h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between m-14 mr-10">
          <div className="flex-row flex-2 pr-8">
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              Corporate Tax Filing
            </h1>

            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              For Individual Establishment- File Form 1040 with Schedule C.
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              A sole proprietorship, as the name indicates, is a business owned
              and managed by a single individual. This person is solely
              accountable for the business operations and enjoys all the
              profits. Compared to other legal structures, sole proprietorships
              involve less paperwork and are subject to fewer business
              restrictions. Its simplicity and ease make it a favored business
              model. However, you will need to obtain local licenses to legally
              operate as a sole proprietor.
            </p>

            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              Partnerships - File Form 1065
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              A partnership is defined as a business relationship between two or
              more individuals who jointly run a trade or business. Notably, a
              partnership does not pay taxes on its earnings. Instead, it must
              disclose its income and losses through Form 1065. The partnership
              also needs to issue a K-1 form to each partner, outlining their
              respective shares of profits and losses. These forms enable the
              IRS to monitor how profits and losses are divided among the
              partners.
            </p>

            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              Corporation - File Form 1120
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              To put it plainly, a corporation exists as a separate entity from
              its shareholders. Additionally, corporations provide limited
              liability protection to their directors and shareholders.
              Corporations are also treated as distinct taxpayers for federal
              tax purposes, meaning they must file their own federal income tax
              returns and pay their own income taxes accordingly.
            </p>

            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              S Corporations - File Form 1120S and issue Schedule K-1 for each
              shareholder
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              S corporations are those entities that opt to pass their losses,
              deductions, and credits through to shareholders for federal tax
              purposes. The shareholders then include these profits and losses
              on their personal tax returns. Its also worth noting that S
              corporations are taxed based on the individual tax rates of their
              shareholders, thereby avoiding the double taxation typically
              imposed on corporate income.
              <br />
              Wondering how to handle tax filings for various entities?
              Don&#39;t stress—we&#39;re here to help you file your taxes
              efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateTaxFiling;
