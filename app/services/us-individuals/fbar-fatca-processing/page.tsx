import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FBAR & FATCA Compliance Services - Cooper's Taxation",
  description:
    "Ensure compliance with FBAR (FinCEN Form 114) and FATCA (IRS Form 8938) regulations. Cooper's Taxation provides expert guidance for accurate filing and reporting.",
  keywords: [
    'FBAR filing',
    'FATCA compliance',
    'FinCEN Form 114',
    'IRS Form 8938',
    'foreign bank account reporting',
    "Cooper's Taxation FBAR FATCA",
    'tax compliance services',
    'FBAR and FATCA filing',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "FBAR & FATCA Compliance Services | Cooper's Taxation",
    description:
      "Stay compliant with foreign asset reporting laws. Cooper's Taxation specializes in FBAR (FinCEN Form 114) and FATCA (IRS Form 8938) filing services.",
    url: 'https://www.cooperstaxation.com/services/us-individuals/fbar-fatca-processing',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/Services-FBAR-FATCA-min.jpg',
        alt: "FBAR & FATCA Compliance Services - Cooper's Taxation",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "FBAR & FATCA Compliance Services - Cooper's Taxation",
    description:
      "Need help with FBAR and FATCA compliance? Cooper's Taxation offers expert filing services for FinCEN Form 114 and IRS Form 8938.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/Services-FBAR-FATCA-min.jpg',
        alt: "FBAR & FATCA Compliance Services - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical:
      'https://www.cooperstaxation.com/services/us-individuals/fbar-fatca-processing',
    languages: {
      'en-US':
        'https://www.cooperstaxation.com/services/us-individuals/fbar-fatca-processing',
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

const FbarFatcaComponent = () => {
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
            src={'/Services-FBAR-FATCA-min.jpg'}
            alt="Fbar-Fatca-Processing"
            className="absolute top-0 left-0 z-0 object-cover"
            quality={100}
            fill
            sizes="100vw"
            priority
          />

          <div className="flex justify-center items-center h-full w-full absolute top-0 left-0">
            <div className="bg-[#C84B31] p-5 mb-10 text-center rounded-lg text-white z-10 opacity-85">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl pb-2 font-poppins">
                FBAR FATCA Processing
              </h1>
              <h5 className="text-xs sm:text-sm text-white font-poppins">
                Home / US-Individuals / Fbar-Fatca-Processing
              </h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between m-14 mr-10">
          <div className="flex-row flex-2 pr-8">
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              FBAR/FATCA Processing
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              If you hold an account in any foreign bank, you must report it
              annually to the U.S. Treasury Department. The nature of these
              accounts can vary from one institution to another. To make things
              easier for our clients, we have listed certain types of accounts,
              such as mutual funds, brokerage accounts, and checking or savings
              accounts, along with other financial assets. Under the Bank
              Secrecy Act, U.S. residents are required to file a Foreign Bank
              Account Report (FBAR). If your total balance across foreign
              accounts is at least $10,000, you must also file FinCEN Form 114.
            </p>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              In all honesty, filing FinCEN Form 114 is compulsory for every
              U.S. citizen with a foreign bank account. Failure to comply can
              lead to harsh penalties, which may even include criminal charges.
            </p>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              Be aware that besides FinCEN Form 114, you will also need to file
              FATCAs Form 8938. However, there are specific criteria that you
              must satisfy in order to be required to file the FATCA form.
            </p>

            <ul
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4 list-disc pl-5 space-y-2`}
            >
              <li>
                As a U.S. resident filing taxes as an individual, you must file
                this form if your foreign assets are valued at over $50,000 on
                the last day of the year. You will also need to file if the
                value of your assets reached $75,000 or more at any time during
                the financial year.
              </li>
              <li>
                If you&#39;re a U.S. expatriate living overseas and filing taxes
                as a single individual, you must file this form if your foreign
                assets exceed $200,000 in value. Furthermore, if your assets
                value reaches $300,000 at any time during the year, you are also
                required to file.
              </li>
              <li>
                If you reside in the U.S. and are filing a joint return with
                your spouse, you need to file this form if your foreign bank
                assets are valued at over $100,000 at the end of the financial
                year.
              </li>
              <li>
                If you&#39;re a U.S. expatriate residing overseas and filing
                jointly with your spouse, you must file if your foreign assets
                have an aggregate value of more than $400,000, or if their value
                has at any time reached $600,000.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FbarFatcaComponent;
