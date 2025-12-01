import Link from 'next/link'
import { servicesData } from '../../data/services'

export default function ServicesPage() {
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-poppins">Our Tax Services</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Comprehensive tax and financial services tailored to meet your specific needs. 
            From individual tax preparation to complex business solutions.
          </p>
        </div>

        {/* Service Categories */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-[#C84B31] text-white rounded-full hover:bg-[#a03929] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              All Services
            </button>
            <button className="px-8 py-3 border-2 border-[#C84B31] text-[#C84B31] rounded-full hover:bg-[#C84B31] hover:text-white transition-all duration-300 font-semibold">
              Individual
            </button>
            <button className="px-8 py-3 border-2 border-[#C84B31] text-[#C84B31] rounded-full hover:bg-[#C84B31] hover:text-white transition-all duration-300 font-semibold">
              Business
            </button>
            <button className="px-8 py-3 border-2 border-[#C84B31] text-[#C84B31] rounded-full hover:bg-[#C84B31] hover:text-white transition-all duration-300 font-semibold">
              NRI Services
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-[#C84B31]/20"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-poppins group-hover:text-[#C84B31] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                {service.description}
              </p>
              
              {/* Pricing Preview */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2 font-medium">Starting from:</p>
                <p className="text-2xl font-bold text-[#C84B31]">
                  {service.category === 'individual' && service.pricing.individual !== 'Not applicable'
                    ? service.pricing.individual
                    : service.category === 'business' && service.pricing.business !== 'Not applicable'
                    ? service.pricing.business
                    : service.category === 'nri' && service.pricing.nri !== 'Not applicable'
                    ? service.pricing.nri
                    : 'Contact for pricing'}
                </p>
              </div>

              {/* Features Preview */}
              <div className="mb-8">
                <ul className="text-sm text-gray-600 space-y-2">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-3 text-lg">✓</span>
                      {feature}
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-gray-400 text-xs mt-2 ml-6">
                      +{service.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              <Link
                href={`/services/${service.id}`}
                className="w-full bg-[#C84B31] text-white py-3 px-6 rounded-full hover:bg-[#a03929] transition-all duration-300 text-center block font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-poppins">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
            Don't see exactly what you're looking for? We offer customized tax and financial services 
            to meet your unique requirements. Our experienced team is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-[#C84B31] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#a03929] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Contact Us Today
            </Link>
            <a
              href="https://wa.me/14144467545"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#C84B31] text-[#C84B31] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#C84B31] hover:text-white transition-all duration-300"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}