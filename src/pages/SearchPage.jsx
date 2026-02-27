import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tmdbApi } from '../utils/tmdbApi';
import { FaSearch } from 'react-icons/fa';
import { getPlaceholderImage } from '../utils/placeholderImage';

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimerRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback((query) => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, 500); // 500ms delay
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchQuery) {
      setSearchQuery(query);
      debouncedSearch(query);
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchParams, debouncedSearch]);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Search movies
      const movieResults = await tmdbApi.searchMovies(query);
      
      // Search TV shows
      const tvResults = await tmdbApi.searchTVShows(query);
      
      // Combine and format results
      const combinedResults = [
        ...movieResults.results.map(item => ({
          id: item.id,
          title: item.title,
          image: tmdbApi.getImageUrl(item.poster_path),
          banner: tmdbApi.getBackdropUrl(item.backdrop_path),
          year: item.release_date?.split('-')[0],
          rating: item.adult ? 'R' : 'PG-13',
          match: Math.round(item.vote_average * 10),
          description: item.overview,
          type: 'movie'
        })),
        ...tvResults.results.map(item => ({
          id: item.id,
          title: item.name,
          image: tmdbApi.getImageUrl(item.poster_path),
          banner: tmdbApi.getBackdropUrl(item.backdrop_path),
          year: item.first_air_date?.split('-')[0],
          rating: 'TV-14',
          match: Math.round(item.vote_average * 10),
          description: item.overview,
          type: 'tv'
        }))
      ];

      // Filter out items without images and sort by match score
      const filteredResults = combinedResults
        .filter(item => item.image && item.match > 0)
        .sort((a, b) => b.match - a.match);

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setSearchResults([]);
      setHasSearched(false);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Cancel debounce and search immediately
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      performSearch(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="px-4 md:px-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearchSubmit} className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search for movies, shows, actors, genres..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-800 text-white pl-14 pr-6 py-4 rounded-lg text-lg outline-none focus:ring-2 focus:ring-white transition"
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </form>
          {searchQuery && (
            <p className="text-gray-400 text-sm mt-2">
              {isLoading ? 'Searching...' : hasSearched ? `Found ${searchResults.length} results` : 'Type to search'}
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && searchResults.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Searching...</p>
            </div>
          </div>
        )}

        {/* Empty State - No Search Yet */}
        {!isLoading && !hasSearched && searchQuery.trim() === '' && (
          <div className="text-center py-20">
            <FaSearch className="text-gray-600 text-6xl mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-2">Find your next favorite</p>
            <p className="text-gray-500">Start typing to search movies and shows</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && hasSearched && searchQuery.trim() !== '' && searchResults.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No results found for "{searchQuery}"</p>
            <p className="text-gray-500 mb-8">Try different keywords or check your spelling</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setHasSearched(false);
              }}
              className="text-white hover:text-gray-300 underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            <h2 className="text-white text-2xl font-bold mb-6">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {searchResults.map((movie) => (
                <div
                  key={`${movie.type}-${movie.id}`}
                  className="relative group cursor-pointer"
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

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center px-2">
                        <p className="text-white text-sm font-bold mb-1 line-clamp-2">{movie.title}</p>
                        {movie.match && movie.match > 0 && (
                          <p className="text-green-500 text-xs font-bold">{movie.match}% Match</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="mt-2">
                    <h3 className="text-white text-sm font-semibold truncate">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      {movie.year && (
                        <span className="text-gray-400">{movie.year}</span>
                      )}
                      <span className="text-gray-500 capitalize">{movie.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;