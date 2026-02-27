import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaInfoCircle, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import VideoPlayer from './VideoPlayer';
import { getBannerPlaceholder } from '../utils/placeholderImage';

function Hero({ movie }) {
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [movie]);

  if (!movie) return null;

  const handlePlayClick = () => {
    setShowPlayer(true);
  };

  const handleMoreInfoClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <>
      <div className={`relative w-full h-screen transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background Image with Ken Burns effect */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div 
            className="w-full h-full scale-110 animate-slowZoom"
            style={{
              backgroundImage: `url('${movie.banner || getBannerPlaceholder(movie.title)}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Multi-layer Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-4 md:px-12 lg:px-16 pb-32">
          <div className="max-w-2xl space-y-6 slide-in-left">
            {/* Title with gradient effect */}
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-5 drop-shadow-2xl leading-tight">
              {movie.title}
            </h1>

            {/* Movie Info Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {movie.match && (
                <span className="bg-green-600 text-white px-3 py-1 font-bold text-sm rounded-sm">
                  {movie.match}% Match
                </span>
              )}
              {movie.year && (
                <span className="text-gray-300 font-semibold text-lg">
                  {movie.year}
                </span>
              )}
              {movie.rating && (
                <span className="border-2 border-gray-400 text-gray-300 px-2 py-0.5 font-bold text-sm">
                  {movie.rating}
                </span>
              )}
              {movie.seasons && (
                <span className="text-gray-300 font-semibold">
                  {movie.seasons} Season{movie.seasons > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed drop-shadow-xl max-w-xl">
              {truncateText(movie.description, 200)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
              <button 
                className="flex items-center justify-center gap-2 md:gap-3 bg-white text-black px-6 py-3 md:px-10 md:py-4 rounded-sm font-bold text-base md:text-xl hover:bg-white/90 active:bg-white/80 transition-all duration-300 shadow-xl hover:scale-105 group"
                onClick={handlePlayClick}
              >
                <FaPlay className="text-sm md:text-lg transition-transform group-hover:scale-110" />
                <span>Play</span>
              </button>

              <button 
                className="flex items-center justify-center gap-2 md:gap-3 glass text-white px-6 py-3 md:px-10 md:py-4 rounded-sm font-bold text-base md:text-xl glass-hover transition-all duration-300 shadow-xl hover:scale-105 group"
                onClick={handleMoreInfoClick}
              >
                <FaInfoCircle className="text-lg md:text-2xl transition-transform group-hover:scale-110" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <button 
          className="absolute bottom-32 right-8 glass text-white rounded-full p-3 hover:bg-white/20 transition-all duration-300 z-20 border-2 border-white/30 hover:border-white/60 hover:scale-110"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <FaVolumeMute className="text-xl" /> : <FaVolumeUp className="text-xl" />}
        </button>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Video Player */}
      {showPlayer && movie && (
        <VideoPlayer 
          movie={movie}
          onClose={handleClosePlayer}
        />
      )}

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes slowZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        .animate-slowZoom {
          animation: slowZoom 20s ease-in-out infinite alternate;
        }
      `}</style>
    </>
  );
}

export default Hero;