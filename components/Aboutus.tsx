import Image from 'next/image';
import {
  FaAccessibleIcon,
  FaHandsHelping,
  FaCheckCircle,
} from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="bg-[#f6dfdb] py-12 px-4 md:px-6 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
        {/* Left Section - Illustration */}
        <div className="w-full sm:w-3/5 md:w-3/5 relative h-[200px] sm:h-[200px] md:h-[300px] sm:mt-4 rounded-lg overflow-hidden">
          <Image
            src="/About.png"
            alt="About Cooper's Taxation"
            fill
            className="absolute object-contain rounded-lg"
            quality={100}
            priority
          />
        </div>

        {/* Right Section - Text */}
        <div className="w-full md:w-3/4 text-center md:text-left">
          <h1 className="text-lg sm:text-2xl md:text-4xl text-[#C84B31] pb-6 font-poppins">
            Accessible, Approachable & Accountable
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-xl pb-6 text-black font-poppins max-w-5xl mx-auto">
            Cooper&apos;s Taxation is staffed by a team of seasoned
            professionals with over a decade of experience. Our expertise spans
            business bookkeeping, taxation, and payroll services, ensuring
            top-quality assistance.
          </p>
        </div>
      </div>

      {/* New Section - Horizontal Cards */}
      <div className="flex mt-12 bg-[#C84B31] py-8 rounded-lg max-w-7xl mx-auto justify-center">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-6">
          {/* Card 1 */}
          <div className="flex flex-col items-center bg-[#ffffff] text-[#C84B31] px-6 py-8 rounded-lg shadow-md w-full md:w-1/3">
            <FaAccessibleIcon className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Accessible</h3>
            <p className="text-center text-md text-black">
              We ensure our services are easy to reach and understand for all
              clients.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center bg-[#ffffff] text-[#C84B31] px-6 py-8 rounded-lg shadow-md w-full md:w-1/3">
            <FaHandsHelping className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Approachable</h3>
            <p className="text-center text-md text-black">
              Our team is friendly and ready to assist you with any tax-related
              queries.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center bg-[#ffffff] text-[#C84B31] px-6 py-8 rounded-lg shadow-md w-full md:w-1/3">
            <FaCheckCircle className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Accountable</h3>
            <p className="text-center text-md text-black">
              We take responsibility for our work and ensure client
              satisfaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;