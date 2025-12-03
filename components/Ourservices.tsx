import React from 'react';
import ServiceBox from './ServiceBox';

interface ServiceData {
  id: string;
  heading: string;
  paragraph: string;
  icon: 'business' | 'individual' | 'nri';
  url: string;
}

interface ServicesSectionProps {
  servicesData: ServiceData[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ servicesData }) => (
  <section className="py-16 bg-[#f9f7f7]">
    <div className="container mx-auto px-4">
      <h1 className="text-lg sm:text-2xl md:text-4xl text-[#C84B31] pb-6 font-poppins text-center">
        Our Tax Services
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesData.map((service) => (
          <ServiceBox key={service.id} service={service} />
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;