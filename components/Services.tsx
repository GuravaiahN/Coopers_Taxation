'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { servicesData, ServiceData } from '../data/services'

const iconMap = {
  '📊': '📊',
  '🏦': '🏦', 
  '📄': '📄',
  '⚖️': '⚖️',
  '📝': '📝',
  '🇮🇳': '🇮🇳',
  '🏢': '🏢',
  '💼': '💼',
  '🏛️': '🏛️',
}

interface ServiceCardProps {
  service: ServiceData
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { title, description, icon, url } = service

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="p-6 relative overflow-hidden flex-grow">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C84B31] to-[#C84B31] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 transition-colors duration-300 group-hover:text-white flex flex-col h-full">
          <div className="text-3xl mb-4">{icon}</div>
          <h3 className="text-xl font-semibold mb-2 text-[#C84B31] group-hover:text-white">
            {title}
          </h3>
          <p className="text-md mb-4 group-hover:text-gray-100 flex-grow">
            {description}
          </p>
          <Link
            href={url || `/services/${service.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-[#C84B31] bg-[#f6dfdb] group-hover:bg-white group-hover:text-[#C84B31] transition-colors duration-300 mt-auto"
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

const Services: React.FC = () => {
  return (
    <section id="services" className="py-16 bg-[#f9f7f7]">
      <div className="container mx-auto px-4">
        <h1 className="text-lg sm:text-2xl md:text-4xl text-[#C84B31] pb-6 font-poppins text-center">
          Our Tax Services
        </h1>
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center text-black pb-12 font-poppins max-w-3xl mx-auto">
          Drive your business forward with our results-driven services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services