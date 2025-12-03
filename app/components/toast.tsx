import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from 'react-icons/fa';
import useToastStore from '@/stores/useToastStore';

const Toast: React.FC = () => {
  const { message, isVisible, type, hideToast, duration } = useToastStore();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const intervalStep = duration / 100;
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(prev - 1, 0));
      }, intervalStep);

      const timer = setTimeout(() => hideToast(), duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isVisible, duration, hideToast]);

  if (!isVisible) return null;

  const backgroundColor =
    type === 'success'
      ? 'bg-green-600'
      : type === 'error'
        ? 'bg-red-600'
        : 'bg-yellow-600';

  const Icon =
    type === 'success'
      ? FaCheckCircle
      : type === 'error'
        ? FaTimesCircle
        : FaExclamationTriangle;

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-80 p-4 rounded-lg shadow-lg text-white ${backgroundColor} transition-all duration-300 ease-in-out transform ${
        isVisible ? 'translate-y-0' : '-translate-y-10 opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-center">
        <Icon size={24} className="mr-3" />
        <div className="flex-1 font-poppins">{message}</div>
        <button
          onClick={hideToast}
          className="ml-4 text-white hover:text-gray-200 p-1"
        >
          <AiOutlineClose size={20} />
        </button>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-full mt-3">
        <div
          className="h-full bg-white rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Toast;