'use client';

import React, { useState, useEffect } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { FaSpinner } from 'react-icons/fa';
import Toast from './toast';
import useSessionStore from '@/stores/useSessionStore'; // Global session store
import useToastStore from '@/stores/useToastStore'; // Global toast store

const steps = ['Personal Info', 'Documents', 'Review'];

function RefundForm() {
  const { session, loading: sessionLoading } = useSessionStore(); // Session and loading state
  const { showToast, isVisible } = useToastStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [documents, setDocuments] = useState<(File | null)[]>(
    new Array(13).fill(null)
  );
  const [additionalDocuments, setAdditionalDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [overallProgress, setOverallProgress] = useState<number>(0);

  // Populate form fields with session data after loading
  useEffect(() => {
    if (!sessionLoading && session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
      }));
    }
  }, [session, sessionLoading]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFileSize = (files: (File | null)[]) => {
    for (const file of files) {
      if (file && file.size > 4 * 1024 * 1024) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateForm()) return;

    if (
      currentStep === 1 &&
      (!validateFileSize(documents) || !validateFileSize(additionalDocuments))
    ) {
      showToast('Each file must be less than 4MB.', 'error');
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      showToast('Please fill in all required fields.', 'error');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      showToast('Invalid email format.', 'error');
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      showToast('Invalid phone number.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const totalFiles =
      documents.filter(Boolean).length + additionalDocuments.length;
    const progressArray = new Array(totalFiles).fill(0);
    setUploadProgress(progressArray);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);

      documents.forEach((file, index) => {
        if (file) formDataToSend.append(`documents-${index}`, file);
      });

      additionalDocuments.forEach((file) =>
        formDataToSend.append('additionalDocuments', file)
      );

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/refund', true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setOverallProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            showToast(
              'Your refund request has been submitted successfully!',
              'success'
            );
            setDocuments(new Array(13).fill(null));
            setAdditionalDocuments([]);
            setCurrentStep(0);
            resolve();
          } else {
            showToast('Failed to submit the refund request.', 'error');
            reject(new Error('Failed to submit the refund request.'));
          }
        };

        xhr.onerror = () => {
          showToast('Unexpected error occurred during submission.', 'error');
          reject(new Error('Unexpected error occurred during submission.'));
        };

        xhr.onloadend = () => {
          resolve();
        };

        xhr.send(formDataToSend);
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('Unexpected error occurred.', 'error');
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setOverallProgress(0);
        setUploadProgress([]);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl  mb-8 font-bold text-center text-red-800">
          Refund Estimate Form
        </h2>
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-[#C84B31] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-sm">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#C84B31] rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
        <div className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-red-300 rounded-md outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-red-300 rounded-md outline-none"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-red-300 rounded-md outline-none"
              />
              <textarea
                name="message"
                placeholder="Additional Information"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-red-300 rounded-md outline-none"
              />
            </div>
          )}
          {currentStep === 1 && (
            <DocumentUpload
              documents={documents}
              setDocuments={setDocuments}
              additionalDocuments={additionalDocuments}
              setAdditionalDocuments={setAdditionalDocuments}
            />
          )}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Review Your Information
              </h3>
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Phone:</strong> {formData.phone}
              </p>
              <p>
                <strong>Message:</strong> {formData.message}
              </p>
              <div>
                <strong>Documents:</strong>
                <ul className="list-disc pl-5">
                  {documents.map(
                    (file, index) =>
                      file && (
                        <li key={index}>
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{' '}
                          MB)
                        </li>
                      )
                  )}
                </ul>
              </div>
              <div>
                <strong>Additional Documents:</strong>
                <ul className="list-disc pl-5">
                  {additionalDocuments.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {isSubmitting && (
          <div className="mt-6">
            <p>Overall Upload Progress: {overallProgress.toFixed(2)}%</p>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${overallProgress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
              ></div>
            </div>
            <div>
              {uploadProgress.map((progress, index) => (
                <div key={index} className="mt-2">
                  <p>
                    File {index + 1}: {progress.toFixed(2)}%
                  </p>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-2 bg-red-400 text-gray-700 rounded-md"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-red-400 text-gray-700 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-400 text-gray-700 rounded-md"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Submit'}
            </button>
          )}
        </div>
      </div>
      {isVisible && <Toast />}
    </div>
  );
}

export default RefundForm;
