// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';

// type Service = {
//   title: string;
//   description: string;
//   image: string;
//   link: string;
// };

// const services: Service[] = [
//   {
//     title: 'Federal and State Tax Filing',
//     description:
//       'We, at Eazy Refund Tax, have a dedicated E-Return Originator that is legally registered with the latest IRS Rules, Circular 230',
//     image: '/service1.jpg',
//     link: '/services/us-individuals/federal-and-state-tax-filing',
//   },
//   {
//     title: 'FBAR/FATCA Processing',
//     description:
//       'You will be asked to report your financial transaction details to the United States Department of Treasury on a yearly basis',
//     image: '/service2.jpg',
//     link: '/services/us-individuals/fbar-fatca-processing',
//   },
//   {
//     title: 'Representation Services',
//     description:
//       "If you receive the letter stating that your income tax return has been selected for an audit, you don't have to worry about it",
//     image: '/service13.jpg',
//     link: '/services/us-individuals/representation-services',
//   },
//   {
//     title: 'ITIN Processing',
//     description:
//       "Most people don't know when a non-US person needs an ITIN and what an ITIN exactly implies.",
//     image: '/service4.jpg',
//     link: '/services/us-individuals/itin-processing',
//   },
//   {
//     title: 'Amendment Filing',
//     description:
//       'Amendment filing services come to the fore when you need to change your return in case of errors while filing the return.',
//     image: '/service5.jpg',
//     link: '/services/us-individuals/amendment-filing',
//   },
//   {
//     title: 'Indian Tax Filing',
//     description:
//       'Eazy Refund Tax has incorporated a dedicated processing center solely for India. It helps our Indian clients with business.',
//     image: '/service6.jpg',
//     link: '/services/us-individuals/indian-tax-filing',
//   },
//   {
//     title: 'Entity Formation',
//     description:
//       'The first step to start a business is to decide on the structure of the business. If you fail to select the right structure.',
//     image: '/service7.jpg',
//     link: '/services/us-business/entity-formation',
//   },
//   {
//     title: 'Corporate Tax Filing',
//     description:
//       'The name sole ownership itself says that these businesses are owned by single persons and the owners of these companies.',
//     image: '/service9.jpg',
//     link: '/services/us-business/corporate-tax-filing',
//   },
//   {
//     title: 'Limited Liability Company',
//     description:
//       ' A Limited Liability Company (LLC) is a business structure that combines characteristics of both sole proprietorships and corporations.',
//     image: '/service8.jpg',
//     link: '/services/us-business/limited-liability-company',
//   },
// ];

// type ServiceCardProps = {
//   service: Service;
// };

// const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <Link href={service.link}>
//       <div
//         className="group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div className="relative h-64 w-full">
//           <Image
//             src={service.image}
//             alt={service.title}
//             fill
//             className={`object-cover transition-transform duration-300 ease-in-out ${
//               isHovered ? 'scale-110 blur-sm' : 'scale-100'
//             }`}
//             priority
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
//         </div>
//         <div className="absolute inset-0 flex items-center justify-center p-6 text-[#ffffff] transform transition-transform duration-300 h-full">
//           <div className="text-center">
//             <h2
//               className={`mb-2 font-montserrat text-lg sm:text-xl md:text-2xl lg:text-2xl ${
//                 isHovered
//                   ? ''
//                   : 'absolute inset-0 flex items-center justify-center'
//               }`}
//             >
//               {service.title}
//             </h2>
//             <p
//               className={`text-xs sm:text-sm md:text-base transition-opacity duration-300 font-poppins ${
//                 isHovered ? 'opacity-100' : 'opacity-0'
//               }`}
//             >
//               {service.description}
//             </p>
//           </div>
//         </div>
//         <div
//           className={`absolute top-4 right-4 bg-[#C84B31] text-white px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
//             isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
//           }`}
//         >
//           Learn More
//         </div>
//       </div>
//     </Link>
//   );
// };

// const Services = () => {
//   return (
//     <section className="bg-white">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
//         <h1
//           className="text-xl sm:text-2xl md:text-3xl lg:text-4xl pt-12  text-center mb-4 font-poppins
//         text-[#C84B31]"
//         >
//           Our Services
//         </h1>
//         <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center text-black pb-12 font-poppins max-w-3xl mx-auto">
//           Drive your business forward with our results-driven services.
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {services.map((service, index) => (
//             <ServiceCard key={index} service={service} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Services;

'use client';

import React from 'react';
import ServiceBox from './ServiceBox';
import { servicesData } from '../data/services';

const ServicesSection: React.FC = () => {
  // Safer mapping for icons based on category
  const mapCategoryToIcon = (category: string) => {
    switch (category) {
      case 'business':
        return 'business';
      case 'nri':
        return 'nri';
      default:
        return 'individual';
    }
  };

  return (
    <section className="py-20 bg-[#f9f7f7]">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold text-[#C84B31]">
            Our Tax Services
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Comprehensive tax, bookkeeping, payroll, and compliance solutions designed to support 
            individuals, businesses, and NRIs with expert precision.
          </p>
        </div>

        {/* Services Grid */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-8
          animate-fadeIn
        ">
          {servicesData.slice(0, 6).map((service) => (
            <ServiceBox
              key={service.id}
              service={{
                id: String(service.id),
                heading: service.title,
                paragraph: service.description,
                icon: mapCategoryToIcon(service.category),
                url: service.url,
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;

