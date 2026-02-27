import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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


function VideoPlayer({ movie, onClose }) {
  const navigate = useNavigate();
  const videoContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  // Simulate video duration (random between 45-120 minutes)
  useEffect(() => {
    const simulatedDuration = Math.floor(Math.random() * (7200 - 2700) + 2700); // 45-120 min in seconds
    setDuration(simulatedDuration);
  }, []);

  // Add this useEffect to save progress every 10 seconds
useEffect(() => {
  if (!isPlaying || duration === 0) return;
  
  const saveInterval = setInterval(() => {
    const progressPercentage = (currentTime / duration) * 100;
    addToContinueWatching(movie.id, progressPercentage, currentTime);
  }, 10000); // Save every 10 seconds
  
  return () => clearInterval(saveInterval);
}, [isPlaying, currentTime, duration, movie.id]);

// Also save on close
const handleClose = () => {
  const progressPercentage = (currentTime / duration) * 100;
  if (progressPercentage > 5 && progressPercentage < 95) {
    addToContinueWatching(movie.id, progressPercentage, currentTime);
  }
  if (onClose) onClose();
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

  // Simulate video playback
  useEffect(() => {
    if (!isPlaying || duration === 0) return;
    
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
  }, [isPlaying, duration]);

  // Update progress bar
  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  // Format time (seconds to HH:MM:SS or MM:SS)
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
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  // Skip forward/backward
  const skip = (seconds) => {
    setCurrentTime(prev => {
      const newTime = prev + seconds;
      if (newTime < 0) return 0;
      if (newTime > duration) return duration;
      return newTime;
    });
    setShowControls(true);
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    const bar = progressBarRef.current;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const newTime = (percentage / 100) * duration;
    setCurrentTime(newTime);
    setShowControls(true);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
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

  // Handle mouse move to show controls
  const handleMouseMove = () => {
    setShowControls(true);
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
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'Escape':
          if (onClose) onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentTime]);

  return (
    <div 
      ref={videoContainerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onClick={togglePlayPause}
    >
      {/* Video Preview/Thumbnail */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img 
          src={movie.banner} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
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

        {/* Loading Spinner (when playing) */}
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 transition"
          >
            <FaTimes className="text-3xl" />
          </button>
          
          <div className="text-white">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
          </div>

          <button className="text-white hover:text-gray-300 transition">
            <FaCog className="text-2xl" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
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
            {/* Left Controls */}
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button 
                onClick={togglePlayPause}
                className="hover:text-gray-300 transition text-3xl"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              {/* Skip Backward */}
              <button 
                onClick={() => skip(-10)}
                className="hover:text-gray-300 transition text-2xl"
              >
                <FaBackward />
              </button>

              {/* Skip Forward */}
              <button 
                onClick={() => skip(10)}
                className="hover:text-gray-300 transition text-2xl"
              >
                <FaForward />
              </button>

              {/* Volume Control */}
              <div 
                className="flex items-center gap-2 relative"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button 
                  onClick={toggleMute}
                  className="hover:text-gray-300 transition text-2xl"
                >
                  {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                
                {showVolumeSlider && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                )}
              </div>

              {/* Time Display */}
              <div className="text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              {/* Episode Selector (for series) */}
              {movie.seasons && (
                <button className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 rounded text-sm transition">
                  S1:E1
                </button>
              )}

              {/* Fullscreen */}
              <button 
                onClick={toggleFullscreen}
                className="hover:text-gray-300 transition text-2xl"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>

        {/* Skip Intro/Credits Buttons */}
        {currentTime > 30 && currentTime < 120 && (
          <button 
            onClick={() => skip(90)}
            className="absolute right-8 bottom-32 bg-white/90 hover:bg-white text-black px-6 py-3 rounded font-bold transition"
          >
            Skip Intro
          </button>
        )}

        {progress > 90 && (
          <button 
            className="absolute right-8 bottom-32 bg-white/90 hover:bg-white text-black px-6 py-3 rounded font-bold transition"
            onClick={onClose}
          >
            Next Episode
          </button>
        )}
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
}

export default VideoPlayer;