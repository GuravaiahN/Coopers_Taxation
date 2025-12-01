import { notFound } from 'next/navigation'
import Link from 'next/link'
import { servicesData } from '../../../data/services'

interface ServiceDetailPageProps {
  params: {
    id: string
  }
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = servicesData.find(s => s.id === parseInt(params.id))
  
  if (!service) {
    notFound()
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-red-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/services" className="hover:text-red-600">
                Services
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{service.title}</li>
          </ol>
        </nav>

        {/* Service Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{service.icon}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{service.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {service.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Features Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Benefits</h2>
              <div className="space-y-4">
                {service.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-red-600 text-lg">★</span>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Process</h2>
              <div className="space-y-6">
                {service.process.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pricing</h3>
              <div className="space-y-3">
                {service.pricing.individual !== 'Not applicable' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Individual:</span>
                    <span className="font-semibold text-red-600">{service.pricing.individual}</span>
                  </div>
                )}
                {service.pricing.business !== 'Not applicable' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Business:</span>
                    <span className="font-semibold text-red-600">{service.pricing.business}</span>
                  </div>
                )}
                {service.pricing.nri !== 'Not applicable' && service.pricing.nri !== 'Contact for pricing' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">NRI:</span>
                    <span className="font-semibold text-red-600">{service.pricing.nri}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors text-center block font-medium"
                >
                  Get Started
                </Link>
              </div>
              
              <p className="text-sm text-gray-500 mt-3 text-center">
                Free consultation available
              </p>
            </div>

            {/* Contact Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Have Questions?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span className="text-gray-700">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span className="text-gray-700">info@cooperstaxservice.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🕒</span>
                  <span className="text-gray-700">Mon-Fri: 9AM-6PM</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  href="/contact"
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Contact us today →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Related Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {servicesData
              .filter(s => s.id !== service.id && s.category === service.category)
              .slice(0, 3)
              .map((relatedService) => (
                <div key={relatedService.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">{relatedService.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {relatedService.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {relatedService.description}
                  </p>
                  <Link
                    href={`/services/${relatedService.id}`}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Learn More →
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}