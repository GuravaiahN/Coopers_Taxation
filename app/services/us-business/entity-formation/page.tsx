import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Entity Formation Services - Cooper's Taxation",
  description:
    "Choose the best entity structure for your business with Cooper's Taxation. We specialize in incorporation, LLC formation, and compliance services to help your business succeed.",
  keywords: [
    'entity formation',
    'business incorporation',
    'LLC formation',
    'S-corporation setup',
    'partnership formation',
    "Cooper's Taxation services",
    'business compliance',
    'start a business',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "Entity Formation Services | Cooper's Taxation",
    description:
      "Simplify your business setup with Cooper's Taxation. From LLCs to S-corporations, we guide you through the entity formation process for long-term success.",
    url: 'https://www.cooperstaxation.com/services/us-business/entity-formation',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/services-entity-formation-min.jpg',
        alt: "Entity Formation Services - Cooper's Taxation",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Entity Formation Services - Cooper's Taxation",
    description:
      "Looking to incorporate your business? Cooper's Taxation offers expert assistance with LLCs, S-corporations, and partnership setups.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/services-entity-formation-min.jpg',
        alt: "Entity Formation Services - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical:
      'https://www.cooperstaxation.com/services/us-business/entity-formation',
    languages: {
      'en-US':
        'https://www.cooperstaxation.com/services/us-business/entity-formation',
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

const EntityFormation = () => {
  const backgroundColor = 'bg-white';
  const textColor = 'text-black';
  const secondaryTextColor = 'text-gray-800';

  return (
    <div className={`${backgroundColor} ${textColor} shadow-md flex relative`}>
      <div className="flex-1 overflow-y-auto relative">
        <div className="relative h-[500px]">
          {/* Image */}
          <Image
            src={'/services-entity-formation-min.jpg'}
            alt="Entity-Formation"
            className="absolute top-0 left-0 z-0 object-cover"
            quality={100}
            fill
            sizes="100vw"
            priority
          />

          <div className="flex justify-center items-center h-full w-full absolute top-0 left-0">
            <div className="bg-[#C84B31] p-5 rounded-lg font-poppins mb-10 text-white z-10 opacity-85">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl pb-2 font-poppins">
                Entity Formation
              </h1>
              <h5 className="text-xs sm:text-sm text-white font-poppins">
                Home / US-Individuals / Entity-Formation
              </h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between m-14 mr-10">
          <div className="flex-row flex-2 pr-8">
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              Entity Formation
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              One of the key steps in launching a business is selecting the
              appropriate entity structure. It&#39;s undeniable that the online
              world can sometimes mislead with information from unverified
              sources. Choosing the wrong entity at the start can cost you
              thousands in taxes and potentially lead to the loss of assets.
            </p>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              This is where we can provide effective assistance. We will help
              you make the right choices and prepare the required documents to
              establish entities like corporations, LLCs, partnerships, and
              others. With our reliable incorporation services, we ensure that
              your documents are prepared with precision and efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityFormation;
