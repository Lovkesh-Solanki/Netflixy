import { useState, useEffect, useRef } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaExpand, 
  FaCompress, 
  FaVolumeUp, 
  FaVolumeMute,
  FaBackward,
  FaForward,
  FaTimes,
  FaCog
} from 'react-icons/fa';
import { addToContinueWatching } from '../utils/continueWatching';
import { tmdbApi } from '../utils/tmdbApi';

function VideoPlayer({ movie, onClose }) {
  const videoContainerRef = useRef(null);
  const iframeRef = useRef(null);
  const progressBarRef = useRef(null);
  
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasTrailer, setHasTrailer] = useState(false);

  // Load trailer from TMDB
  useEffect(() => {
    loadTrailer();
  }, [movie.id]);

  const loadTrailer = async () => {
    setIsLoadingTrailer(true);
    try {
      // Determine if it's a movie or TV show
      const isMovie = movie.type === 'movie' || !movie.type;
      
      // Fetch videos from TMDB
      const videos = await tmdbApi.getVideos(movie.id, isMovie ? 'movie' : 'tv');
      
      // Find trailer (prefer official trailer, then teaser)
      const trailer = videos.find(v => 
        v.type === 'Trailer' && 
        v.site === 'YouTube' &&
        v.official
      ) || videos.find(v => 
        v.type === 'Trailer' && 
        v.site === 'YouTube'
      ) || videos.find(v => 
        v.type === 'Teaser' && 
        v.site === 'YouTube'
      );

      if (trailer) {
        setTrailerKey(trailer.key);
        setHasTrailer(true);
        setDuration(180); // Assume 3 minutes for trailer
      } else {
        setHasTrailer(false);
        // Fallback: use demo video duration
        setDuration(5400); // 90 minutes
      }
    } catch (error) {
      console.error('Error loading trailer:', error);
      setHasTrailer(false);
      setDuration(5400);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (!showControls) return;
    
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  // Simulate video playback (for non-trailer content)
  useEffect(() => {
    if (!isPlaying || duration === 0 || hasTrailer) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        if (newTime >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, duration, hasTrailer]);

  // Update progress bar
  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  // Save progress when playing
  useEffect(() => {
    if (!isPlaying || duration === 0 || hasTrailer) return;
    
    const saveInterval = setInterval(() => {
      const progressPercentage = (currentTime / duration) * 100;
      addToContinueWatching(movie.id, progressPercentage, currentTime);
    }, 10000);
    
    return () => clearInterval(saveInterval);
  }, [isPlaying, currentTime, duration, movie.id, hasTrailer]);

  // Format time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (hasTrailer && iframeRef.current) {
      // For YouTube iframe, we can't control it directly
      // Just toggle our state
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
    setShowControls(true);
  };

  // Skip forward/backward
  const skip = (seconds) => {
    if (!hasTrailer) {
      setCurrentTime(prev => {
        const newTime = prev + seconds;
        if (newTime < 0) return 0;
        if (newTime > duration) return duration;
        return newTime;
      });
    }
    setShowControls(true);
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (hasTrailer) return; // Can't seek YouTube iframe without API
    
    const bar = progressBarRef.current;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const newTime = (percentage / 100) * duration;
    setCurrentTime(newTime);
    setShowControls(true);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    setShowControls(true);
  };

  // Handle mouse move
  const handleMouseMove = () => {
    setShowControls(true);
  };

  // Handle close
  const handleClose = () => {
    if (!hasTrailer) {
      const progressPercentage = (currentTime / duration) * 100;
      if (progressPercentage > 5 && progressPercentage < 95) {
        addToContinueWatching(movie.id, progressPercentage, currentTime);
      }
    }
    if (onClose) onClose();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          if (!hasTrailer) skip(-10);
          break;
        case 'ArrowRight':
          if (!hasTrailer) skip(10);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          handleClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentTime, hasTrailer]);

  return (
    <div 
      ref={videoContainerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Video Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {isLoadingTrailer ? (
          // Loading State
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading player...</p>
          </div>
        ) : hasTrailer && trailerKey ? (
          // YouTube Trailer
          <div className="w-full h-full">
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=${isPlaying ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          // Fallback: Static Image with Play Controls
          <>
            <img 
              src={movie.banner} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Play/Pause Icon Center */}
            {!isPlaying && (
              <button 
                className="absolute inset-0 flex items-center justify-center group"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
              >
                <div className="bg-black/60 rounded-full p-8 group-hover:bg-black/80 transition">
                  <FaPlay className="text-white text-6xl ml-2" />
                </div>
              </button>
            )}

            {/* Simulated Playing State */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">Playing: {movie.title}</div>
                  <p className="text-gray-300">Full movie not available - Trailer mode</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        } ${hasTrailer ? 'pointer-events-none' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-300 transition"
          >
            <FaTimes className="text-3xl" />
          </button>
          
          <div className="text-white">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            {hasTrailer && <p className="text-sm text-gray-300 mt-1">Official Trailer</p>}
          </div>

          <button className="text-white hover:text-gray-300 transition">
            <FaCog className="text-2xl" />
          </button>
        </div>

        {/* Bottom Controls - Only for non-trailer */}
        {!hasTrailer && (
          <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
            {/* Progress Bar */}
            <div 
              ref={progressBarRef}
              className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer mb-4 group relative"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-red-600 rounded-full relative transition-all group-hover:h-2"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlayPause}
                  className="hover:text-gray-300 transition text-3xl"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                <button 
                  onClick={() => skip(-10)}
                  className="hover:text-gray-300 transition text-2xl"
                >
                  <FaBackward />
                </button>

                <button 
                  onClick={() => skip(10)}
                  className="hover:text-gray-300 transition text-2xl"
                >
                  <FaForward />
                </button>

                <div className="text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleFullscreen}
                  className="hover:text-gray-300 transition text-2xl"
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trailer Notice */}
        {hasTrailer && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-lg pointer-events-auto">
            <p className="text-white text-center font-semibold">
              ▶ Watching Official Trailer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;