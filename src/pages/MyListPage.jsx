import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyList, removeFromMyList } from '../utils/LocalStorage';
import { tmdbApi } from '../utils/tmdbApi';
import { FaPlay, FaTrash, FaSort, FaTimes } from 'react-icons/fa';
import { getPlaceholderImage } from '../utils/placeholderImage';
import Toast from '../components/Toast';

function MyListPage() {
  const navigate = useNavigate();
  const [myListMovies, setMyListMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('added'); // 'added', 'title', 'rating'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadMyList();

    const handleStorageChange = () => {
      loadMyList();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('myListUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('myListUpdated', handleStorageChange);
    };
  }, []);

  const loadMyList = async () => {
    setIsLoading(true);
    
    try {
      const myListIds = getMyList();
      
      if (myListIds.length === 0) {
        setMyListMovies([]);
        setIsLoading(false);
        return;
      }

      const moviePromises = myListIds.map(async (id) => {
        try {
          const movie = await tmdbApi.getMovieDetails(id);
          
          if (!movie || movie.status_code === 34) {
            return null;
          }
          
          return {
            id: movie.id,
            title: movie.title || movie.name || 'Unknown Title',
            image: tmdbApi.getImageUrl(movie.poster_path),
            banner: tmdbApi.getBackdropUrl(movie.backdrop_path),
            year: movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : null),
            rating: movie.adult ? 'R' : (movie.content_ratings?.results?.[0]?.rating || 'PG-13'),
            match: movie.vote_average ? Math.round(movie.vote_average * 10) : null,
            description: movie.overview || 'No description available.',
            genres: movie.genres?.map(g => g.name) || []
          };
        } catch (error) {
          console.error(`Error fetching movie ${id}:`, error);
          removeFromMyList(id);
          return null;
        }
      });

      const moviesData = await Promise.all(moviePromises);
      const validMovies = moviesData.filter(movie => movie !== null);
      
      setMyListMovies(validMovies);
    } catch (error) {
      console.error('Error loading My List:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromList = (movieId, e) => {
    e.stopPropagation();
    
    removeFromMyList(movieId);
    window.dispatchEvent(new Event('myListUpdated'));
    loadMyList();
    
    setToast({
      message: 'Removed from My List',
      type: 'info'
    });
  };

  const handlePlayMovie = (movieId, e) => {
    e.stopPropagation();
    navigate(`/movie/${movieId}`);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all items from My List?')) {
      myListMovies.forEach(movie => removeFromMyList(movie.id));
      window.dispatchEvent(new Event('myListUpdated'));
      loadMyList();
      setToast({
        message: 'Cleared all items',
        type: 'info'
      });
    }
  };

  const getSortedMovies = () => {
    const sorted = [...myListMovies];
    
    switch(sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return sorted.sort((a, b) => (b.match || 0) - (a.match || 0));
      case 'added':
      default:
        return sorted; // Already in order added
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-black">
        <div className="px-4 md:px-12">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">
            My List
          </h1>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading your list...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (myListMovies.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-black">
        <div className="px-4 md:px-12">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-12 text-center max-w-2xl mx-auto mt-20">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mx-auto mb-6">
              <FaPlay className="text-white text-4xl ml-1" />
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">Your list is empty</h2>
            <p className="text-gray-400 text-lg mb-8">
              Add movies and shows you want to watch later
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary inline-flex items-center gap-2"
            >
              Discover Content
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedMovies = getSortedMovies();

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black page-transition">
      <div className="px-4 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
              My List
            </h1>
            <p className="text-gray-400">
              {myListMovies.length} {myListMovies.length === 1 ? 'title' : 'titles'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Options */}
            <div className="flex items-center gap-2 glass px-4 py-2 rounded border border-gray-800">
              <FaSort className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer text-sm font-semibold"
              >
                <option value="added">Recently Added</option>
                <option value="title">Title (A-Z)</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Clear All */}
            <button
              onClick={handleClearAll}
              className="glass border border-gray-800 px-4 py-2 rounded text-white hover:bg-red-600 hover:border-red-600 transition-all flex items-center gap-2 font-semibold text-sm"
            >
              <FaTimes />
              Clear All
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="relative group cursor-pointer scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={movie.image || getPlaceholderImage(movie.title)}
                  alt={movie.title}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(movie.title);
                  }}
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                  <button
                    onClick={(e) => handlePlayMovie(movie.id, e)}
                    className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition transform hover:scale-110"
                    title="Play"
                  >
                    <FaPlay className="text-sm" />
                  </button>

                  <button
                    onClick={(e) => handleRemoveFromList(movie.id, e)}
                    className="bg-red-600 text-white rounded-full p-3 hover:bg-red-700 transition border-2 border-white transform hover:scale-110"
                    title="Remove from My List"
                  >
                    <FaTrash className="text-sm" />
                  </button>

                  <p className="text-white text-xs text-center font-semibold line-clamp-2">
                    {movie.title}
                  </p>
                </div>
              </div>

              {/* Movie Info */}
              <div className="mt-2">
                <h3 className="text-white text-sm font-semibold truncate">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  {movie.match && movie.match > 0 && (
                    <span className="text-green-500 font-bold">
                      {movie.match}% Match
                    </span>
                  )}
                  {movie.year && (
                    <span className="text-gray-400">{movie.year}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Browsing */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Want to add more?</p>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary inline-flex items-center gap-2"
          >
            Browse More Content
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default MyListPage;