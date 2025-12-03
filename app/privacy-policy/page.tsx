'use client';
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              <strong>Last updated:</strong> December 3, 2025
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                At Cooper's Taxation, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Personal information (name, email address, phone number)</li>
                <li>Tax-related documents and financial information</li>
                <li>Communication records with our team</li>
                <li>Payment and billing information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Provide tax preparation and related services</li>
                <li>Process payments and manage your account</li>
                <li>Communicate with you about our services</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Improve our services and customer experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>To tax authorities as required by law</li>
                <li>To our trusted service providers who assist in our operations</li>
                <li>When required by legal process or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Encryption of sensitive data</li>
                <li>Secure file transmission protocols</li>
                <li>Regular security assessments</li>
                <li>Limited access controls</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Retention</h2>
              <p className="mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Tax records are typically retained for at least 7 years as required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Cookies and Tracking</h2>
              <p className="mb-4">
                Our website uses cookies and similar technologies to improve your browsing experience and analyze site usage. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p><strong>Cooper's Taxation</strong></p>
                <p>Email: privacy@cooperstaxation.com</p>
                <p>Phone: [Your Phone Number]</p>
                <p>Address: [Your Business Address]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              This privacy policy is effective as of December 3, 2025.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;