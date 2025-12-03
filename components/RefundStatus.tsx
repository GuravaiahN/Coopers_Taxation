'use client';

import React, { useState } from 'react';
import { Search, Clock, CheckCircle, AlertCircle, Phone } from 'lucide-react';

const RefundStatus = () => {
  const [formData, setFormData] = useState({
    ssn: '',
    filingStatus: '',
    refundAmount: '',
    state: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const filingStatuses = [
    'Single',
    'Married Filing Jointly',
    'Married Filing Separately',
    'Head of Household',
    'Qualifying Widow(er)'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ssn || !formData.filingStatus || !formData.refundAmount) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockStatuses = [
        {
          status: 'approved',
          message: 'Your refund has been approved and is being processed.',
          estimatedDate: 'February 15, 2024',
          amount: formData.refundAmount,
          trackingNumber: 'RF2024001234567'
        },
        {
          status: 'processing',
          message: 'Your return is being processed. Please allow 21 days.',
          estimatedDate: 'February 20, 2024',
          amount: formData.refundAmount,
          trackingNumber: 'RF2024001234568'
        },
        {
          status: 'sent',
          message: 'Your refund has been sent via direct deposit.',
          estimatedDate: 'Completed',
          amount: formData.refundAmount,
          trackingNumber: 'RF2024001234569'
        }
      ];
      
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      setSearchResult(randomStatus);
      setIsSearching(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-8 w-8 text-red-700" />;
      case 'processing':
        return <Clock className="h-8 w-8 text-gray-600" />;
      case 'sent':
        return <CheckCircle className="h-8 w-8 text-red-700" />;
      default:
        return <AlertCircle className="h-8 w-8 text-red-700" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-red-50 border-red-200';
      case 'processing':
        return 'bg-gray-50 border-gray-200';
      case 'sent':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <section id="refund-status" className="py-20 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Check Your Refund Status</h2>
          <p className="text-xl text-gray-600">Track your tax refund progress and get real-time updates</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          {!searchResult ? (
            /* Search Form */
            <form onSubmit={handleSearch} className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="ssn" className="block text-sm font-medium text-black mb-2">
                      Social Security Number *
                    </label>
                    <input
                      type="text"
                      id="ssn"
                      name="ssn"
                      value={formData.ssn}
                      onChange={handleInputChange}
                      required
                      placeholder="XXX-XX-XXXX"
                      maxLength={11}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="filingStatus" className="block text-sm font-medium text-black mb-2">
                      Filing Status *
                    </label>
                    <select
                      id="filingStatus"
                      name="filingStatus"
                      value={formData.filingStatus}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                    >
                      <option value="">Select filing status</option>
                      {filingStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="refundAmount" className="block text-sm font-medium text-black mb-2">
                      Expected Refund Amount *
                    </label>
                    <input
                      type="number"
                      id="refundAmount"
                      name="refundAmount"
                      value={formData.refundAmount}
                      onChange={handleInputChange}
                      required
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-black mb-2">
                      State (Optional)
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
                    >
                      <option value="">Select state (optional)</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    isSearching
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-red-700 hover:bg-red-800 text-white'
                  }`}
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Checking Status...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Check Refund Status</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Search Results */
            <div className="p-8">
              <div className={`border-2 rounded-lg p-6 ${getStatusColor(searchResult.status)}`}>
                <div className="flex items-start space-x-4">
                  {getStatusIcon(searchResult.status)}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-2">
                      Refund Status: {searchResult.status.charAt(0).toUpperCase() + searchResult.status.slice(1)}
                    </h3>
                    <p className="text-gray-700 mb-4">{searchResult.message}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-black">Amount:</span>
                        <p className="text-gray-700">${searchResult.amount}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-black">Expected Date:</span>
                        <p className="text-gray-700">{searchResult.estimatedDate}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-black">Tracking Number:</span>
                        <p className="text-gray-700">{searchResult.trackingNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setSearchResult(null);
                    setFormData({
                      ssn: '',
                      filingStatus: '',
                      refundAmount: '',
                      state: ''
                    });
                  }}
                  className="flex-1 bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors duration-200 font-semibold"
                >
                  Check Another Refund
                </button>
                <a
                  href="#contact"
                  className="flex-1 border-2 border-red-700 text-red-700 px-6 py-3 rounded-lg hover:bg-red-700 hover:text-white transition-colors duration-200 font-semibold text-center"
                >
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black mb-4">Refund Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                <span className="text-gray-700">E-filed returns: 21 days or less</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                <span className="text-gray-700">Paper returns: 6-8 weeks</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                <span className="text-gray-700">Direct deposit: Faster than check</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black mb-4">Need Help?</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-700" />
                <div>
                  <p className="font-semibold text-black">+1 (414) 446-7545</p>
                  <p className="text-sm text-gray-600">Mon-Fri 9AM-7PM (CST)</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Our tax professionals are available to help you understand your refund status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RefundStatus;