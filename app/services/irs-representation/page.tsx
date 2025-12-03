'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, FileText, Calendar, Shield, DollarSign } from 'lucide-react'
import { servicesData } from '../../../data/services'

const serviceData = servicesData.find(service => service.id === 5)

export default function IrsRepresentationPage() {
  if (!serviceData) return <div>Service not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-[#C84B31] text-white py-12">
        <div className="container mx-auto px-4">
          <Link 
            href="/#services" 
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Services
          </Link>
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{serviceData.icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold">{serviceData.title}</h1>
          </div>
          <p className="text-lg text-white/90 max-w-3xl">{serviceData.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Features Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#C84B31] mb-6 flex items-center">
                <FileText className="mr-3 w-6 h-6" />
                What's Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceData.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#C84B31] mb-6 flex items-center">
                <Shield className="mr-3 w-6 h-6" />
                Key Benefits
              </h2>
              <div className="space-y-4">
                {serviceData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#C84B31] mb-6 flex items-center">
                <Calendar className="mr-3 w-6 h-6" />
                Our Process
              </h2>
              <div className="space-y-4">
                {serviceData.process.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C84B31] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-4">
              <h3 className="text-xl font-bold text-[#C84B31] mb-4 flex items-center">
                <DollarSign className="mr-2 w-5 h-5" />
                Pricing
              </h3>
              <div className="space-y-3">
                {serviceData.pricing.individual !== "Not applicable" && (
                  <div>
                    <span className="font-semibold text-gray-700">Individual:</span>
                    <span className="ml-2 text-[#C84B31] font-bold">{serviceData.pricing.individual}</span>
                  </div>
                )}
                {serviceData.pricing.business !== "Not applicable" && (
                  <div>
                    <span className="font-semibold text-gray-700">Business:</span>
                    <span className="ml-2 text-[#C84B31] font-bold">{serviceData.pricing.business}</span>
                  </div>
                )}
                {serviceData.pricing.nri !== "Not applicable" && serviceData.pricing.nri !== "Contact for pricing" && (
                  <div>
                    <span className="font-semibold text-gray-700">NRI:</span>
                    <span className="ml-2 text-[#C84B31] font-bold">{serviceData.pricing.nri}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link
                  href="/contact-us"
                  className="w-full bg-[#C84B31] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#a83d28] transition-colors text-center block"
                >
                  Get Started
                </Link>
              </div>
              
              <div className="mt-4">
                <Link
                  href="/upload"
                  className="w-full bg-gray-100 text-[#C84B31] py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center block"
                >
                  Upload Documents
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[#C84B31] text-white rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <p className="mb-4">Contact our tax experts for personalized assistance.</p>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Phone:</span>
                  +1 (414) 446-7545
                </p>
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Email:</span>
                  info@cooperstaxation.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}