import { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MovieRow({ title, movies, onOpenModal }) {
  const rowRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();
  const scrollTimeoutRef = useRef(null);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const currentRef = rowRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollPosition);
      return () => currentRef.removeEventListener('scroll', checkScrollPosition);
    }
  }, [movies]);

  // Detect page scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      setIsHovered(false);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({
        left: -800,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({
        left: 800,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseEnter = () => {
    if (!isScrolling) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCardClick = (movie) => {
    if (movie.tmdbId) {
      navigate(`/movie/${movie.tmdbId}`);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div 
      className="px-4 md:px-12 mb-8 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Row Title */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 hover:text-gray-300 transition cursor-pointer">
        {title}
      </h2>

      {/* Container for Row and Arrows */}
      <div className="relative group">
        
        {/* Left Arrow */}
        {isHovered && !isScrolling && showLeftArrow && (
          <button 
            className="absolute left-0 top-0 bottom-0 z-30 w-12 md:w-16 bg-black/80 text-white flex items-center justify-center hover:bg-black/90 transition-all duration-300"
            onClick={scrollLeft}
          >
            <FaChevronLeft className="text-3xl md:text-4xl" />
          </button>
        )}

        {/* Movies Container */}
        <div 
          ref={rowRef}
          className="flex gap-2 md:gap-3 overflow-x-scroll overflow-y-hidden scrollbar-hide scroll-smooth py-4"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative flex-shrink-0 w-[150px] md:w-[200px] lg:w-[240px] cursor-pointer transform transition-all duration-300 ease-out hover:scale-110 hover:z-10"
              onClick={() => handleCardClick(movie)}
            >
              <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden shadow-lg">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white font-bold text-sm md:text-base mb-1 line-clamp-2">
                    {movie.title}
                  </h3>
                  {movie.match && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-500 font-bold">{movie.match}% Match</span>
                      {movie.year && <span className="text-gray-300">{movie.year}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {isHovered && !isScrolling && showRightArrow && (
          <button 
            className="absolute right-0 top-0 bottom-0 z-30 w-12 md:w-16 bg-black/80 text-white flex items-center justify-center hover:bg-black/90 transition-all duration-300"
            onClick={scrollRight}
          >
            <FaChevronRight className="text-3xl md:text-4xl" />
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieRow;