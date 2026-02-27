import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContinueWatching, removeFromContinueWatching } from '../utils/continueWatching';
import { movies } from '../data/mockData';
import { FaTimes } from 'react-icons/fa';

function ContinueWatchingRow() {
  const navigate = useNavigate();
  const [continueWatchingItems, setContinueWatchingItems] = useState([]);

  useEffect(() => {
    loadContinueWatching();
  }, []);

  const loadContinueWatching = () => {
    const items = getContinueWatching();
    const moviesWithProgress = items.map(item => {
      const movie = movies.find(m => m.id === item.movieId);
      return movie ? { ...movie, progress: item.progress, timestamp: item.timestamp } : null;
    }).filter(Boolean);
    
    setContinueWatchingItems(moviesWithProgress);
  };

  const handleRemove = (e, movieId) => {
    e.stopPropagation();
    removeFromContinueWatching(movieId);
    loadContinueWatching();
  };

  const handleCardClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  if (continueWatchingItems.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 mb-8">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4">
        Continue Watching
      </h2>

      <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-4">
        {continueWatchingItems.map((movie) => (
          <div
            key={movie.id}
            className="relative flex-shrink-0 w-[300px] md:w-[400px] cursor-pointer group"
            onClick={() => handleCardClick(movie)}
          >
            <div className="relative aspect-video rounded-md overflow-hidden">
              <img
                src={movie.banner}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${movie.progress}%` }}
                ></div>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => handleRemove(e, movie.id)}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-2">
              <h3 className="text-white font-semibold text-sm truncate">
                {movie.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContinueWatchingRow;