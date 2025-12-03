'use client';
import { FaFileAlt, FaChartLine, FaDollarSign } from 'react-icons/fa';

const Pricing = () => {
  const pricingData = [
    {
      description: 'Federal Standard Return (1040)',
      price: '$24.99',
      icon: <FaFileAlt />,
    },
    { description: 'State Tax Return', price: '$44.99', icon: <FaChartLine /> },
    {
      description: 'Federal NR Return (1040-NR)',
      price: '$79.99',
      icon: <FaFileAlt />,
    },
    { description: 'FBAR Filing', price: '$19.99', icon: <FaDollarSign /> },
    {
      description: 'Stock & Dividend Transactions',
      price: '$4.99',
      icon: <FaChartLine />,
    },
    { description: 'ITIN Filing', price: '$99.99', icon: <FaFileAlt /> },
    {
      description: 'City & Local Tax Filings',
      price: '$9.99',
      icon: <FaChartLine />,
    },
    {
      description: 'Sole/Single Member LLC',
      price: '$149.99',
      icon: <FaFileAlt />,
    },
    { description: 'S-Corporation', price: '$399.99', icon: <FaChartLine /> },
    { description: 'Multi-Member LLC', price: '$399.99', icon: <FaFileAlt /> },
    {
      description: 'Schedule-E Charges',
      price: '$109.99 (Min)',
      icon: <FaDollarSign />,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#f9f7f7] to-[#f6dfdb] py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Heading Section */}
        <div className="text-center mb-12">
          <h2 className=" sm:text-2xl md:text-4xl  text-[#C84B31] font-poppins mb-6">
            Pricing: Cooper&apos;s Taxation
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-poppins">
            Discover our transparent and competitive pricing for tax filing and
            financial services.
          </p>
        </div>

        {/* Pricing Table Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {pricingData.map((item, index) => (
            <div
              key={index}
              className="relative group flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-lg transition-transform duration-300 transform hover:scale-105 overflow-hidden"
            >
              {/* Background Slide */}
              <div className="absolute inset-0 bg-[#C84B31] translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-0"></div>

              {/* Circular Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#C84B31] flex justify-center items-center mb-4 sm:mb-6 relative z-10">
                <span className="text-[#C84B31] group-hover:text-white text-3xl transition-colors duration-300 relative z-20">
                  {item.icon}
                </span>
              </div>

              <h3 className="text-md sm:text-lg md:text-xl text-black group-hover:text-white  relative z-20 mb-2 transition-colors duration-300 font-poppins">
                {item.description}
              </h3>
              <p className="text-md sm:text-lg md:text-xl text-gray-600 group-hover:text-white relative z-20 transition-colors duration-300 font-poppins">
                {item.price}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-12">
          <p className="text-md sm:text-lg md:text-xl text-gray-700 font-poppins text-center">
            *Prices may vary based on the complexity of the tax return. Contact
            us for further details.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;