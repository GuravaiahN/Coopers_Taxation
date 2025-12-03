import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Tax Representation Services - Cooper's Taxation",
  description:
    "Get expert tax representation services with Cooper's Taxation. Professional assistance for personal and business tax audits, ensuring compliance and peace of mind.",
  keywords: [
    'tax representation services',
    'IRS audit representation',
    'business tax audits',
    'personal tax audits',
    "Cooper's Taxation representation",
    'tax compliance assistance',
    'audit support services',
    'professional tax representation',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "Tax Representation Services | Cooper's Taxation",
    description:
      "Need help with tax audits? Cooper's Taxation offers expert representation services for personal and business tax compliance.",
    url: 'https://www.cooperstaxation.com/services/us-individuals/representation-services',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/services-representation-min.jpg',
        alt: "Tax Representation Services - Cooper's Taxation",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tax Representation Services - Cooper's Taxation",
    description:
      "Facing a tax audit? Cooper's Taxation provides expert representation services to ensure compliance and resolve tax-related issues effectively.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/services-representation-min.jpg',
        alt: "Tax Representation Services - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical:
      'https://www.cooperstaxation.com/services/us-individuals/representation-services',
    languages: {
      'en-US':
        'https://www.cooperstaxation.com/services/us-individuals/representation-services',
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

const RepresentationServices = () => {
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
            src={'/services-representation-min.jpg'}
            alt="Federal And State Tax Filing"
            className="absolute top-0 left-0 z-0 object-cover"
            quality={100}
            fill
            sizes="100vw"
            priority
          />

          <div className="flex justify-center items-center h-full w-full absolute top-0 left-0 font-poppins">
            <div className="bg-[#C84B31] p-5 mb-10 rounded-lg text-white z-10 opacity-85">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl pb-2 ">
                Representation Services
              </h1>
              <h5 className="text-xs sm:text-sm text-white">
                Home / US-Individuals / Representation-Services
              </h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between m-14 mr-10">
          <div className="flex-row flex-2 pr-8">
            <h1 className="xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl mb-4 font-poppins">
              Representation Services
            </h1>

            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              Receiving a notification that your tax return has been selected
              for an audit can be concerning, but there is no need to panic. In
              situations like these, we&#39;re here to support you every step of
              the way. Our expertise extends to both personal and business tax
              audits. Additionally, even if you believe you have done nothing
              wrong, it&#39;s advisable not to represent yourself.
            </p>
            <p
              className={`${secondaryTextColor} text-sm xs:text-base sm:text-lg md:text-xl font-poppins mb-4`}
            >
              We offer a blend of experience and professionalism when managing
              these cases. In personal audits, it is essential to understand
              that tax returns are chosen for data analysis. With our
              assistance, you can represent yourself smoothly and without
              complications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentationServices;
