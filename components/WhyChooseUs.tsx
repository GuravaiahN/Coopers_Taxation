import React from 'react'
import { CheckCircle, DollarSign, Clock, Shield, Phone, FileCheck } from 'lucide-react'

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Maximum Refunds',
      description: 'We find every deduction and credit you qualify for to maximize your return.'
    },
    {
      icon: Clock,
      title: 'Fast Service',
      description: 'Quick turnaround with electronic filing for faster processing.'
    },
    {
      icon: Shield,
      title: 'Audit Protection',
      description: 'Free audit support and representation included with every return.'
    },
    {
      icon: Phone,
      title: 'Year-Round Support',
      description: 'Access to tax professionals for guidance and consultation.'
    },
    {
      icon: FileCheck,
      title: 'Accuracy Guarantee',
      description: '100% accuracy guarantee on every return we prepare.'
    },
    {
      icon: CheckCircle,
      title: 'Satisfaction Promise',
      description: 'Your satisfaction is guaranteed or we make it right.'
    }
  ]

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Coopers Taxation?</h2>
          <p className="text-xl text-gray-600">Experience the difference of professional tax services</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div key={index} className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <IconComponent className="h-6 w-6 text-red-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs