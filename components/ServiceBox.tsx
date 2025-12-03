import React from 'react';
import { Briefcase, Users, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type ServiceData = {
  id: string;
  heading: string;
  paragraph: string;
  icon: 'business' | 'individual' | 'nri';
  url: string;
};

type ServiceBoxProps = {
  service: ServiceData;
};

const iconMap = {
  business: Briefcase,
  individual: Users,
  nri: FileText,
};

const ServiceBox: React.FC<ServiceBoxProps> = ({ service }) => {
  const { heading, paragraph, icon, url } = service;
  const IconComponent = iconMap[icon];

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="p-6 relative overflow-hidden flex-grow">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C84B31] to-[#C84B31] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 transition-colors duration-300 group-hover:text-white flex flex-col h-full">
          <IconComponent className="w-8 h-8 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-[#C84B31] group-hover:text-white">
            {heading}
          </h3>
          <p className="text-md mb-4 group-hover:text-gray-100 flex-grow">
            {paragraph}
          </p>
          <Link
            href={url}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-[#C84B31] bg-[#f6dfdb] group-hover:bg-white group-hover:text-[#C84B31] transition-colors duration-300 mt-auto"
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceBox;
