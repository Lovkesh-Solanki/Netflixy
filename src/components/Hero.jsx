import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import VideoPlayer from './VideoPlayer';
import { getBannerPlaceholder } from '../utils/placeholderImage';

function Hero({ movie }) {
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);

  if (!movie) return null;

  const handlePlayClick = () => {
    const scrollY = window.scrollY;
    setShowPlayer(true);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  const handleMoreInfoClick = () => {
    const scrollY = window.scrollY;
    navigate(`/movie/${movie.id}`);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  const handleClosePlayer = () => {
    const scrollY = window.scrollY;
    setShowPlayer(false);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  // Truncate description to reasonable length
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <>
      <div className="relative w-full h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('${movie.banner || getBannerPlaceholder(movie.title)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-4 md:px-12 lg:px-16 pb-32">
          <div className="max-w-2xl">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-5 drop-shadow-2xl leading-tight">
              {movie.title}
            </h1>

            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 leading-relaxed drop-shadow-xl max-w-xl">
              {truncateText(movie.description, 200)}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button 
                className="flex items-center justify-center gap-2 md:gap-3 bg-white text-black px-6 py-2 md:px-10 md:py-4 rounded font-bold text-base md:text-xl hover:bg-white/90 active:bg-white/80 transition-all duration-200 shadow-xl hover:scale-105"
                onClick={handlePlayClick}
              >
                <FaPlay className="text-sm md:text-lg" />
                <span>Play</span>
              </button>

              <button 
                className="flex items-center justify-center gap-2 md:gap-3 bg-gray-600/70 backdrop-blur-sm text-white px-6 py-2 md:px-10 md:py-4 rounded font-bold text-base md:text-xl hover:bg-gray-600/50 active:bg-gray-600/40 transition-all duration-200 shadow-xl hover:scale-105"
                onClick={handleMoreInfoClick}
              >
                <FaInfoCircle className="text-lg md:text-2xl" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>
      </div>

      {/* Video Player */}
      {showPlayer && movie && (
        <VideoPlayer 
          movie={movie}
          onClose={handleClosePlayer}
        />
      )}
    </>
  );
}

export default Hero;