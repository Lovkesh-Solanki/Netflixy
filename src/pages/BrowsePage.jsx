import { useState, useEffect } from 'react';
import { tmdbApi, convertTMDBToMovie } from '../utils/tmdbApi';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { FaFilter, FaTimes } from 'react-icons/fa';
import Toast from '../components/Toast';

function BrowsePage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Filter states
  const [selectedType, setSelectedType] = useState('movie');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    loadGenres();
  }, [selectedType]);

  useEffect(() => {
    loadMovies();
  }, [selectedType, selectedGenre, selectedYear, selectedLanguage]);

  const loadGenres = async () => {
    try {
      const data = selectedType === 'movie' 
        ? await tmdbApi.getMovieGenres() 
        : await tmdbApi.getTVGenres();
      setGenres(data.genres || []);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const loadMovies = async () => {
    try {
      setLoading(true);
      
      // Build discover URL
      const BASE_URL = 'https://api.themoviedb.org/3';
      const API_KEY = '9f7e49c70a35d54ccb4a1e489013fce9';
      
      const mediaType = selectedType === 'movie' ? 'movie' : 'tv';
      let url = `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&sort_by=popularity.desc`;
      
      if (selectedGenre) {
        url += `&with_genres=${selectedGenre}`;
      }
      
      if (selectedYear) {
        if (selectedType === 'movie') {
          url += `&primary_release_year=${selectedYear}`;
        } else {
          url += `&first_air_date_year=${selectedYear}`;
        }
      }
      
      if (selectedLanguage) {
        url += `&with_original_language=${selectedLanguage}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        const results = data.results.map(item => convertTMDBToMovie(item, selectedType));
        setMovies(results);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
      setToast({
        message: 'Error loading movies. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedLanguage('');
    setToast({
      message: 'Filters cleared',
      type: 'info'
    });
  };

  const handleToast = (toastData) => {
    setToast(toastData);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  const activeFiltersCount = [selectedGenre, selectedYear, selectedLanguage].filter(Boolean).length;

  return (
    <div className="min-h-screen pt-24 pb-20 page-transition">
      <div className="px-4 md:px-12">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-2 slide-in">
          Browse {selectedType === 'movie' ? 'Movies' : 'TV Shows'}
        </h1>
        <p className="text-gray-400 mb-8">
          Discover content by genre, year, and language
        </p>

        {/* Filters */}
        <div className="glass border border-gray-800 rounded-lg p-6 mb-8 slide-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-red-600" />
              <h2 className="text-white text-xl font-bold">Filters</h2>
              {activeFiltersCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
              >
                <FaTimes />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block font-semibold">Type</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedGenre('');
                }}
                className="w-full glass text-white px-4 py-3 rounded outline-none border border-gray-700 focus:border-red-600 transition-all cursor-pointer hover:border-gray-600"
              >
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block font-semibold">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full glass text-white px-4 py-3 rounded outline-none border border-gray-700 focus:border-red-600 transition-all cursor-pointer hover:border-gray-600"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block font-semibold">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full glass text-white px-4 py-3 rounded outline-none border border-gray-700 focus:border-red-600 transition-all cursor-pointer hover:border-gray-600"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block font-semibold">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full glass text-white px-4 py-3 rounded outline-none border border-gray-700 focus:border-red-600 transition-all cursor-pointer hover:border-gray-600"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            <p className="text-white mt-4">Loading {selectedType === 'movie' ? 'movies' : 'shows'}...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <FaFilter className="text-gray-600 text-6xl mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-2">No results found</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">
                Found {movies.length} {selectedType === 'movie' ? 'movies' : 'shows'}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id}
                  movie={movie}
                  isScrolling={false}
                  onOpenModal={handleOpenModal}
                  onToast={handleToast}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}

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

export default BrowsePage;