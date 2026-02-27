import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaPlay, FaPlus, FaCheck, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { isInMyList, addToMyList, removeFromMyList } from '../utils/LocalStorage';
import { getBannerPlaceholder } from '../utils/placeholderImage';

function MovieModal({ movie, onClose }) {
  const navigate = useNavigate();
  const [inMyList, setInMyList] = useState(false);

  useEffect(() => {
    setInMyList(isInMyList(movie.id));
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [movie.id]);

  const handleToggleMyList = () => {
    const scrollY = window.scrollY;
    
    if (inMyList) {
      removeFromMyList(movie.id);
      setInMyList(false);
    } else {
      addToMyList(movie.id);
      setInMyList(true);
    }
    
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  const handleViewDetails = () => {
    const scrollY = window.scrollY;
    onClose();
    navigate(`/movie/${movie.id}`);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black text-white rounded-full p-2 transition"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Banner Image */}
        <div className="relative w-full h-[40vh] md:h-[50vh]">
          <img 
            src={movie.banner || getBannerPlaceholder(movie.title)}
            alt={movie.title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.target.src = getBannerPlaceholder(movie.title);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 drop-shadow-2xl">
              {movie.title}
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <button 
                className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition"
                onClick={handleViewDetails}
              >
                <FaPlay />
                <span>Play</span>
              </button>
              
              <button 
                className="flex items-center gap-2 bg-gray-700/80 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold transition"
                onClick={handleToggleMyList}
              >
                {inMyList ? <FaCheck /> : <FaPlus />}
              </button>
              
              <button className="flex items-center justify-center bg-gray-700/80 hover:bg-gray-600 text-white rounded-full w-10 h-10 transition">
                <FaThumbsUp />
              </button>
              
              <button className="flex items-center justify-center bg-gray-700/80 hover:bg-gray-600 text-white rounded-full w-10 h-10 transition">
                <FaThumbsDown />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4 text-white">
            {movie.match && <span className="text-green-500 font-bold text-lg">{movie.match}% Match</span>}
            {movie.year && <span>{movie.year}</span>}
            {movie.rating && <span className="border border-gray-400 px-2 py-0.5 text-sm">{movie.rating}</span>}
            {movie.seasons && <span>{movie.seasons} Season{movie.seasons > 1 ? 's' : ''}</span>}
            {movie.duration && <span>{movie.duration}</span>}
          </div>

          <p className="text-white text-base leading-relaxed mb-6">
            {movie.description}
          </p>

          <div className="space-y-3 text-sm mb-6">
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <span className="text-gray-400">Cast: </span>
                <span className="text-white">{movie.cast.join(', ')}</span>
              </div>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <div>
                <span className="text-gray-400">Genres: </span>
                <span className="text-white">{movie.genres.join(', ')}</span>
              </div>
            )}
            {movie.tags && movie.tags.length > 0 && (
              <div>
                <span className="text-gray-400">This {movie.seasons ? 'show' : 'movie'} is: </span>
                <span className="text-white">{movie.tags.join(', ')}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleViewDetails}
            className="text-gray-400 hover:text-white text-sm underline transition"
          >
            View Full Details →
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;