import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center px-4">
        <h1 className="text-white text-9xl font-bold mb-4">404</h1>
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
          Lost your way?
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded font-bold hover:bg-gray-200 transition"
          >
            <FaHome />
            <span>Netflixy Home</span>
          </button>
          
          <button
            onClick={() => navigate('/search')}
            className="flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded font-bold hover:bg-gray-600 transition"
          >
            <FaSearch />
            <span>Search</span>
          </button>
        </div>

        <div className="mt-12">
          <p className="text-gray-500 text-sm">
            Error Code: <span className="font-mono">NFLX-404</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;