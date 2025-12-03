import Image from 'next/image';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import ContactForm from '../components/Contactform';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us - Cooper's Taxation",
  description:
    "Have questions about bookkeeping, taxation, or payroll services? Contact Cooper's Taxation today for professional assistance and support.",
  keywords: [
    "contact Cooper's Taxation",
    'bookkeeping inquiries',
    'taxation inquiries',
    'payroll service inquiries',
    "Cooper's Taxation contact",
    "get in touch with Cooper's Taxation",
    'tax assistance support',
    'business financial inquiries',
  ],
  authors: [
    { name: "Cooper's Taxation", url: 'https://www.cooperstaxation.com' },
  ],
  openGraph: {
    title: "Contact Us | Cooper's Taxation",
    description:
      "Need assistance with bookkeeping, taxation, or payroll? Contact Cooper's Taxation for expert advice and support tailored to your needs.",
    url: 'https://www.cooperstaxation.com/contact-us',
    siteName: "Cooper's Taxation",
    type: 'website',
    images: [
      {
        url: 'https://www.cooperstaxation.com/taxsvg3.svg',
        alt: "Contact Cooper's Taxation - Professional Support",
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Us - Cooper's Taxation",
    description:
      "Reach out to Cooper's Taxation for expert help with bookkeeping, taxation, and payroll services. We're here to assist you.",
    images: [
      {
        url: 'https://www.cooperstaxation.com/taxsvg3.svg',
        alt: "Contact Cooper's Taxation - Professional Support",
      },
    ],
  },
  alternates: {
    canonical: 'https://www.cooperstaxation.com/contact-us',
    languages: {
      'en-US': 'https://www.cooperstaxation.com/contact-us',
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

const ContactUs = () => {
  return (
    <section className="bg-gradient-to-b from-[#f9f7f7] to-[#f6dfdb] py-16">
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Section - Text */}
        <div className="text-center md:text-left lg:pl-20">
          <h2 className="xs:text-3xl sm:text-3xl md:text-4xl  text-[#C84B31] font-poppins mb-6 md:mb-8 leading-tight tracking-tight">
            We&apos;d Love to Hear from You
          </h2>
          <p className="text-md sm:text-lg md:text-xl lg:text-2xl text-black font-poppins mb-8">
            We&apos;re a team of skilled tax professionals dedicated to helping
            people and businesses with their taxes. Our goal is to make the
            complicated tax world easy to understand and navigate so that our
            clients feel confident about their taxes.
          </p>
        </div>

        {/* Right Section - Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg">
          <Image
            src="/taxsvg3.svg"
            alt="Customer Service Illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-[#ffffff]">
        <ContactForm />
      </div>

      {/* Address and Contact Information Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-24 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Contact Information Card */}
        <address className="bg-white rounded-3xl shadow-lg p-8 text-center md:text-left not-italic">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl  text-[#C84B31] font-poppins mb-6">
            Contact Information
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-poppins mb-6">
            Have questions? Our team is available to assist you via phone or
            email. Don&apos;t hesitate to reach out for any inquiries.
          </p>
          <div
            className="flex justify-center md:justify-start items-start space-x-4"
            aria-label="Phone contact"
          >
            <FaPhoneAlt
              className="flex-shrink-0 text-2xl text-[#C84B31]"
              aria-hidden="true"
            />
            <span className="flex-1 text-sm sm:text-base md:text-lg lg:text-xl text-black font-poppins">
              <a
                href="tel:+14172542321"
                aria-label="Phone number for Cooper's Taxation"
              >
                +1-417-254-2321
              </a>
            </span>
          </div>
          <div
            className="flex justify-center md:justify-start items-start space-x-4 mt-4"
            aria-label="Email contact"
          >
            <FaEnvelope
              className="flex-shrink-0 text-2xl text-[#C84B31]"
              aria-hidden="true"
            />
            <span className="flex-1 text-sm sm:text-base md:text-lg lg:text-xl text-black font-poppins">
              <a
                href="mailto:info@cooperstaxation.com"
                aria-label="Email address for Cooper's Taxation"
              >
                info@cooperstaxation.com
              </a>
            </span>
          </div>
        </address>

        {/* Office Address Card */}
        <address className="bg-white rounded-3xl shadow-lg p-8 text-center md:text-left flex flex-col justify-between not-italic">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#C84B31] font-poppins mb-6">
            Visit Our Office
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-poppins mb-6">
            Our office is open for consultations. We welcome you to meet with us
            in person to discuss your financial and tax needs.
          </p>
          <div
            className="flex justify-center md:justify-start items-center space-x-4 mt-4"
            aria-label="Office address"
          >
            <FaMapMarkerAlt
              className="flex-shrink-0 text-2xl text-[#C84B31]"
              aria-hidden="true"
            />
            <span className="flex-1 text-sm sm:text-base md:text-lg lg:text-xl text-black font-poppins">
              Cooper&apos;s Taxation 4050
              <br /> Pennsylvania Ave Ste 15 #272,
              <br /> Kansas City
            </span>
          </div>
        </address>
      </div>
    </section>
  );
};

export default ContactUs;