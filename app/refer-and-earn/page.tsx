import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Refer and Earn Rewards - Cooper's Taxation",
  description:
    "Earn rewards by referring your friends to Cooper's Taxation. Share our professional tax services, and get rewarded for every successful referral.",
  keywords: [
    'refer and earn',
    'referral program',
    "Cooper's Taxation rewards",
    'tax service referral',
    'earn rewards for referrals',
    'referral incentives',
    "Cooper's Taxation refer and earn",
    'tax service promotion',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "Refer and Earn Rewards | Cooper's Taxation",
    description:
      "Refer your friends to Cooper's Taxation and earn exciting rewards for each successful referral. Share our trusted tax services today!",
    url: 'https://www.cooperstaxation.com/refer-and-earn',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/illustrations1.png',
        alt: "Refer and Earn Rewards - Cooper's Taxation",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Refer and Earn Rewards - Cooper's Taxation",
    description:
      "Get rewarded for spreading the word! Refer Cooper's Taxation to your friends and earn rewards for every successful referral.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/illustrations1.png',
        alt: "Refer and Earn Rewards - Cooper's Taxation",
      },
    ],
  },
  alternates: {
    canonical: 'https://www.cooperstaxation.com/refer-and-earn',
    languages: {
      'en-US': 'https://www.cooperstaxation.com/refer-and-earn',
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

const ReferEarn = () => {
  return (
    <section className="bg-[#ffffff] py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#C84B31] font-poppins mb-6 leading-tight tracking-tight">
              Refer and Earn
            </h2>
            <p className="text-md sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-poppins mb-6">
              Please login to your account and provide the information of the
              person&apos;s who you would like to refer to Eazy Refund Tax.
            </p>
            <p className="text-md sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-poppins mb-6">
              If you are not registered yet with Eazy Refund Tax, then please
              Register and start referring your friends. This will help you
              track the status of your referrals in real time.
            </p>
            <Link
              href="/pricing"
              className="bg-[#C84B31] text-white font-poppins py-3 px-6 rounded-lg shadow-lg hover:bg-[#a83b2a] transition duration-300 inline-block"
            >
              Click Here <FaArrowRight className="inline ml-2 font-poppins" />
            </Link>
          </div>

          {/* Right Section - Illustration */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-full">
            <Image
              src="/illustrations1.png" // Ensure to replace this with the correct image path
              alt="Refer and Earn Illustration"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Referral Bonus Table */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-12">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-poppins text-[#C84B31] font-bold mb-6 text-center">
            Referral Bonus Structure
          </h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-center font-poppins">
              <thead className="bg-[#f6dfdb] text-[#C84B31] font-bold font-poppins">
                <tr>
                  <th className="px-4 py-2 font-poppins">
                    Number of Successful Referrals
                  </th>
                  <th className="px-4 py-2 font-poppins">Amount of Bonus</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-poppins">
                <tr>
                  <td className="border px-4 py-2 font-poppins">
                    1 - 10 Referrals
                  </td>
                  <td className="border px-4 py-2 font-poppins ">
                    $10 per successful referral
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-poppins">
                    11 - 20 Referrals
                  </td>
                  <td className="border px-4 py-2 font-poppins">
                    $15 per successful referral
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-poppins">
                    More than 20 Referrals
                  </td>
                  <td className="border px-4 py-2 font-poppins">
                    $20 per successful referral
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Bonus Policy */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-12">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#C84B31] font-poppins mb-6">
            Referral Bonus Policy:
          </h3>
          <ul className="list-disc pl-5 space-y-4 text-md sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-poppins">
            <li>
              The customer has the right to redeem the referral bonus at any
              time if the referral bonus reaches $200.
            </li>
            <li>
              The total referral bonus amount will get accumulated and be
              transferred to the bank account after 15th April only.
            </li>
            <li>One must first register and then start referring friends.</li>
            <li>
              The referrer can track the list of referees, their statuses, and
              referral bonuses earned from their login account.
            </li>
            <li>
              The referral bonus will be offered only upon receipt of payment
              from the referee.
            </li>
            <li>
              The referral bonus scheme is applicable only for those referred
              through the Refer a Friend page and shall not apply to oral
              references.
            </li>
            <li>The bonus is calculated according to the chart above.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ReferEarn;