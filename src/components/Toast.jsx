import { useEffect } from 'react';
import { FaCheck, FaTimes, FaInfoCircle, FaHeart } from 'react-icons/fa';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FaCheck className="text-green-500" />,
    error: <FaTimes className="text-red-500" />,
    info: <FaInfoCircle className="text-blue-500" />,
    favorite: <FaHeart className="text-red-500" />
  };

  const bgColors = {
    success: 'bg-green-900/95',
    error: 'bg-red-900/95',
    info: 'bg-blue-900/95',
    favorite: 'bg-gray-900/95'
  };

  const borderColors = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500',
    favorite: 'border-red-500'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[9999] ${bgColors[type]} ${borderColors[type]} border-l-4 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slideInUp backdrop-blur-sm min-w-[300px]`}>
      <div className="text-2xl animate-scaleIn">
        {icons[type]}
      </div>
      <p className="font-semibold flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-gray-300 hover:text-white transition-colors"
      >
        <FaTimes />
      </button>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
}

export default Toast;