'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Award, TrendingUp, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Coopers Taxation</h2>
            <p className="text-lg text-gray-600 mb-6">
              With over 9 years of experience in tax preparation and financial consulting, 
              we&apos;ve helped thousands of individuals and businesses maximize their returns.
            </p>
            
            <p className="text-lg text-gray-600 mb-8">
              Our certified professionals stay current with ever-changing tax laws to ensure 
              you receive the maximum refund possible while remaining fully compliant.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700">9+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700">5K+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700">99%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/images/FinanceV02.webp"
              alt="Tax Services"
              width={600}
              height={400}
              className="w-full h-auto rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-red-700/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="flex items-start space-x-4">
            <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Expert Team</h4>
              <p className="text-gray-600">Certified professionals with extensive experience</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h4>
              <p className="text-gray-600">Award-winning service and client satisfaction</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Growth</h4>
              <p className="text-gray-600">Helping you maximize returns and minimize liabilities</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Accuracy</h4>
              <p className="text-gray-600">100% accuracy guarantee on every return</p>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals are here to provide you with personalized tax solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <Image
                  src="/images/team3.webp"
                  alt="Tax Professional"
                  width={300}
                  height={300}
                  className="w-48 h-48 mx-auto rounded-full object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-red-700/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Senior Tax Advisor</h4>
              <p className="text-gray-600 mb-4">CPA, MBA - 15+ years experience</p>
              <p className="text-gray-600">
                Specialist in complex tax situations, business planning, and tax optimization strategies.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <Image
                  src="/images/team4.webp"
                  alt="International Tax Specialist"
                  width={300}
                  height={300}
                  className="w-48 h-48 mx-auto rounded-full object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-red-700/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">International Tax Specialist</h4>
              <p className="text-gray-600 mb-4">EA, MST - 12+ years experience</p>
              <p className="text-gray-600">
                Expert in international tax matters, FBAR/FATCA compliance, and NRI tax services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;