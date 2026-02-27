import { useEffect } from 'react';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

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
    info: <FaInfoCircle className="text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-900/90',
    error: 'bg-red-900/90',
    info: 'bg-blue-900/90'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slideIn`}>
      <div className="text-2xl">
        {icons[type]}
      </div>
      <p className="font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-gray-300 hover:text-white transition"
      >
        <FaTimes />
      </button>
    </div>
  );
}

export default Toast;