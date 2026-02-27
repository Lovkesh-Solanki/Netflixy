import { useState, useEffect } from 'react';
import { tmdbApi, convertTMDBToMovie } from '../utils/tmdbApi';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { FaFilter } from 'react-icons/fa';

function BrowsePage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
      
      const params = {};
      if (selectedGenre) params.with_genres = selectedGenre;
      if (selectedYear) params.primary_release_year = selectedYear;
      if (selectedLanguage) params.with_original_language = selectedLanguage;
      params.sort_by = 'popularity.desc';

      const data = selectedType === 'movie'
        ? await tmdbApi.discoverMovies(params)
        : await tmdbApi.discoverTV(params);

      const results = data.results.map(item => convertTMDBToMovie(item, selectedType));
      setMovies(results);
    } catch (error) {
      console.error('Error loading movies:', error);
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

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="px-4 md:px-12">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">
          Browse
        </h1>

        {/* Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-white" />
            <h2 className="text-white text-xl font-bold">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Type</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedGenre(''); // Reset genre when type changes
                }}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none border border-gray-700 focus:border-white transition"
              >
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none border border-gray-700 focus:border-white transition"
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
              <label className="text-gray-400 text-sm mb-2 block">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none border border-gray-700 focus:border-white transition"
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
              <label className="text-gray-400 text-sm mb-2 block">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none border border-gray-700 focus:border-white transition"
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

          {/* Clear Filters */}
          {(selectedGenre || selectedYear || selectedLanguage) && (
            <button
              onClick={() => {
                setSelectedGenre('');
                setSelectedYear('');
                setSelectedLanguage('');
              }}
              className="mt-4 text-gray-400 hover:text-white text-sm underline transition"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No results found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <h2 className="text-white text-xl font-bold mb-6">
              Found {movies.length} {selectedType === 'movie' ? 'movies' : 'shows'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id}
                  movie={movie}
                  isScrolling={false}
                  onOpenModal={handleOpenModal}
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
    </div>
  );
}

export default BrowsePage;