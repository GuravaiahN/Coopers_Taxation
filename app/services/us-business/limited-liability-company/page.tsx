import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Limited Liability Company (LLC) Formation - Cooper's Taxation",
  description:
    "Simplify the process of forming and managing a Limited Liability Company (LLC) with Cooper's Taxation. Expert guidance for business compliance and growth.",
  keywords: [
    'LLC formation',
    'Limited Liability Company',
    'business formation',
    'LLC compliance services',
    "Cooper's Taxation",
    'LLC management',
    'business setup',
    'tax services for LLC',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "Limited Liability Company (LLC) Formation | Cooper's Taxation",
    description:
      "Form and manage your Limited Liability Company (LLC) with ease. Cooper's Taxation offers expert services for LLC compliance, management, and growth.",
    url: 'https://www.cooperstaxation.com/services/us-business/limited-liability-company',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/services-LLP-min.jpg',
        alt: "LLC Formation Services - Cooper's Taxation",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Limited Liability Company (LLC) Formation - Cooper's Taxation",
    description:
      "Looking to form an LLC? Cooper's Taxation provides professional assistance for LLC setup, compliance, and management.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/services-LLP-min.jpg',
        alt: "LLC Formation Services - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical:
      'https://www.cooperstaxation.com/services/us-business/limited-liability-company',
    languages: {
      'en-US':
        'https://www.cooperstaxation.com/services/us-business/limited-liability-company',
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

const LimitedLiabilityCompany = () => {
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
            src={'/services-LLP-min.jpg'}
            alt="Limited-Liability-Company"
            className="absolute top-0 left-0 z-0 object-cover"
            quality={100}
            fill
            sizes="100vw"
            priority
          />

          <div className="flex justify-center items-center h-full w-full absolute top-0 left-0">
            <div className="bg-[#C84B31] p-5 rounded-lg font-poppins mb-10 text-white z-10 opacity-85">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl pb-2 font-poppins">
                Limited Liability Company
              </h1>
              <h5 className="text-xs sm:text-sm text-white font-poppins">
                Home / US-Individuals / Limited-Liability-Company
              </h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between m-14 mr-10">
          <div className="flex-row flex-2 pr-8">
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              Limited Liability Company
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              A Limited Liability Company (LLC) is a business structure that
              combines characteristics of both sole proprietorships and
              corporations. An LLC can be taxed like a sole proprietorship or
              partnership, depending on its setup. Additionally, the LLC model
              offers limited liability protection to its owners.
            </p>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              Keep in mind that an LLC is not treated as a separate entity for
              tax purposes. This means the company doesn&#39;t pay taxes or
              directly report its losses. Instead, the founders report the
              business&#39;s profits or losses on their own tax returns. Similar
              to corporations, members of an LLC are shielded from personal
              liabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitedLiabilityCompany;
