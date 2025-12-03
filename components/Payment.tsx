'use client';

import React, { useState } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

const Payment = () => {
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Federal Tax Filing', description: 'Complete federal tax return preparation and filing', active: true },
    { id: '2', name: 'State Tax Filing', description: 'State tax return preparation for all states', active: true },
    { id: '3', name: 'FBAR & FATCA', description: 'Foreign account reporting compliance', active: true },
    { id: '4', name: 'ITIN Processing', description: 'Individual Taxpayer Identification Number application', active: true },
    { id: '5', name: 'Business Tax Filing', description: 'Corporate and business tax preparation', active: true }
  ]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState('');
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customAmount || !selectedService) {
      setError('Please fill in all required fields.');
      return;
    }

    const amount = parseFloat(customAmount);
    if (amount <= 0) {
      setError('Amount must be greater than $0.00');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Simulate payment processing
      setTimeout(() => {
        setPaidAmount(amount);
        setPaymentComplete(true);
        setIsProcessing(false);
      }, 2000);
    } catch (err: any) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const getSelectedService = () => {
    return services.find(s => s.id === selectedService);
  };

  if (paymentComplete) {
    const service = getSelectedService();
    return (
      <section className="py-20 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="bg-red-700 w-24 h-24 rounded-lg flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-black mb-6">Payment Successful!</h2>
            <p className="text-xl text-gray-600 mb-4">
              Thank you for choosing Coopers Taxation.
            </p>
            <p className="text-lg text-gray-600 mb-10">
              Payment of ${paidAmount.toFixed(2)} {service && `for ${service.name}`} has been processed.
            </p>
            
            <button
              onClick={() => {
                setPaymentComplete(false);
                setSelectedService('');
                setCustomAmount('');
              }}
              className="bg-red-700 text-white px-8 py-4 rounded-lg hover:bg-red-800 transition-colors duration-200 font-semibold"
            >
              Return to Services
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-6">Tax Services & Pricing</h2>
          <p className="text-xl text-gray-600">
            Select your service and complete secure payment to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Services Selection */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-black mb-8">Select Your Service</h3>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`relative border-2 rounded-lg p-8 cursor-pointer transition-all duration-200 ${
                    selectedService === service.id
                      ? 'border-red-700 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <input
                        type="radio"
                        checked={selectedService === service.id}
                        onChange={() => setSelectedService(service.id)}
                        className="h-6 w-6 text-red-700 focus:ring-red-700 border-gray-300"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-black mb-2">{service.name}</h4>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Custom pricing</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-8">Payment Details</h3>
              
              {/* Payment Amount Section */}
              <div className="border-b border-gray-200 pb-6 mb-8">
                <div className="space-y-4">
                  {selectedService && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 font-medium">
                        Selected: {getSelectedService()?.name}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Amount ($)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the amount you&apos;d like to pay for this service
                    </p>
                  </div>

                  {customAmount && parseFloat(customAmount) > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total</span>
                        <span className="text-red-700">${parseFloat(customAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedService && (
                <form onSubmit={handlePayment}>
                  {/* Payment Method */}
                  <div className="mb-8">
                    <h4 className="font-bold text-black mb-4">Payment Method</h4>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                        <span className="text-gray-700 font-medium">Credit/Debit Card</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVC
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-6 w-6 text-red-700 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-black text-sm">Secure Payment</h5>
                        <p className="text-gray-700 text-sm">
                          Your payment is protected by 256-bit SSL encryption.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    disabled={isProcessing || !selectedService}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-colors duration-200 ${
                      isProcessing || !selectedService
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-red-700 hover:bg-red-800 text-white'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : !customAmount || parseFloat(customAmount) <= 0 ? (
                      'Enter Payment Amount'
                    ) : (
                      `Pay $${parseFloat(customAmount).toFixed(2)}`
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;