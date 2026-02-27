import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaChevronDown } from 'react-icons/fa';
import { isInMyList, addToMyList, removeFromMyList } from '../utils/LocalStorage';
import { getPlaceholderImage } from '../utils/placeholderImage';

function MovieCard({ movie, isScrolling, onOpenModal }) {
  const navigate = useNavigate();
  const [inList, setInList] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if movie is in My List
    const checkList = isInMyList(movie.id);
    setInList(checkList);
    
    // Listen for My List updates
    const handleMyListUpdate = () => {
      const updated = isInMyList(movie.id);
      setInList(updated);
    };
    
    window.addEventListener('myListUpdated', handleMyListUpdate);
    
    return () => {
      window.removeEventListener('myListUpdated', handleMyListUpdate);
    };
  }, [movie.id]);

  const handleToggleMyList = (e) => {
    e.stopPropagation();
    if (inList) {
      removeFromMyList(movie.id);
      setInList(false);
    } else {
      addToMyList(movie.id);
      setInList(true);
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleMoreInfo = (e) => {
    e.stopPropagation();
    if (onOpenModal) {
      onOpenModal(movie);
    }
  };

  return (
    <div 
      className={`relative group transition-all duration-300 cursor-pointer ${
        isScrolling ? '' : 'hover:scale-110 hover:z-30'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Movie Poster */}
      <img 
        src={movie.image || getPlaceholderImage(movie.title)}
        alt={movie.title}
        className="w-full h-auto rounded-md"
        onError={(e) => {
          e.target.src = getPlaceholderImage(movie.title);
        }}
      />

      {/* Add to List Button - Top Right - ALWAYS VISIBLE ON HOVER */}
      <div className={`absolute top-2 right-2 z-30 transition-all duration-200 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <button
          onClick={handleToggleMyList}
          className="bg-black/80 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white hover:text-black transition-all duration-200 shadow-lg border-2 border-white/50 hover:border-white"
          title={inList ? 'Remove from My List' : 'Add to My List'}
        >
          {inList ? (
            <FaCheck className="text-sm" />
          ) : (
            <FaPlus className="text-sm" />
          )}
        </button>
      </div>
      
      {/* Hover Overlay - Bottom */}
      {isHovered && !isScrolling && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 rounded-b-md">
          <h3 className="text-white font-bold text-sm mb-2 truncate">{movie.title}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <button 
              className="bg-white text-black rounded-full p-1.5 hover:bg-gray-200 transition"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movie/${movie.id}`);
              }}
              title="Play"
            >
              <FaPlay className="text-xs" />
            </button>
            
            <button 
              className="bg-gray-800/90 text-white rounded-full p-1.5 hover:bg-gray-700 transition border-2 border-gray-600"
              onClick={handleToggleMyList}
              title={inList ? 'Remove from My List' : 'Add to My List'}
            >
              {inList ? <FaCheck className="text-xs" /> : <FaPlus className="text-xs" />}
            </button>
            
            <button 
              className="bg-gray-800/90 text-white rounded-full p-1.5 hover:bg-gray-700 transition border-2 border-gray-600 ml-auto"
              onClick={handleMoreInfo}
              title="More Info"
            >
              <FaChevronDown className="text-xs" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-white">
            {movie.match && <span className="text-green-500 font-bold">{movie.match}% Match</span>}
            {movie.rating && <span className="border border-gray-400 px-1">{movie.rating}</span>}
            {movie.seasons && <span>{movie.seasons} Season{movie.seasons > 1 ? 's' : ''}</span>}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="text-gray-400 text-xs mt-1">
              {movie.genres.slice(0, 3).join(' • ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieCard;