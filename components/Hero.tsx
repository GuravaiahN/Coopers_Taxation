import { ArrowRight, CheckCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const Hero = () => {
  return (
    <section id="home" className="pt-12 pb-20 bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            {/* Main Headline */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Professional Tax Services You Can Trust
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Expert tax preparation and planning services. Maximize your refund with our experienced professionals who understand your unique financial situation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#contact"
                className="bg-red-700 text-white px-8 py-4 rounded-lg hover:bg-red-800 transition-colors duration-200 font-semibold inline-flex items-center justify-center"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="tel:+14144467545"
                className="border-2 border-red-700 text-red-700 px-8 py-4 rounded-lg hover:bg-red-700 hover:text-white transition-colors duration-200 font-semibold inline-flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call (414) 446-7545
              </a>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-red-700 flex-shrink-0" />
                <span className="text-gray-700">Maximum refunds guaranteed</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-red-700 flex-shrink-0" />
                <span className="text-gray-700">Expert professional guidance</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-red-700 flex-shrink-0" />
                <span className="text-gray-700">Year-round support available</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="order-1 lg:order-2">
            <div className="w-full h-auto max-w-lg mx-auto rounded-lg shadow-lg bg-gradient-to-br from-red-100 to-red-200 p-8 text-center">
              <Image
                src="/images/FinanceV02.webp"
                alt="Professional Tax Services"
                width={400}
                height={300}
                className="w-full h-auto rounded-lg mb-4"
                priority
              />
              <h3 className="text-2xl font-bold text-red-800 mb-2">Professional Tax Services</h3>
              <p className="text-red-700">Expert guidance for all your tax needs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
