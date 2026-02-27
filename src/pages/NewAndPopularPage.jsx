import { useState, useEffect } from 'react';
import { tmdbApi, convertTMDBToMovie } from '../utils/tmdbApi';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';

function NewAndPopularPage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewAndPopular();
  }, []);

  const loadNewAndPopular = async () => {
    try {
      setLoading(true);
      const [trendingMoviesData, trendingTVData, popularMoviesData, popularTVData] = await Promise.all([
        tmdbApi.getTrendingMovies(),
        tmdbApi.getTrendingTVShows(),
        tmdbApi.getPopularMovies(),
        tmdbApi.getPopularTVShows()
      ]);

      setTrendingMovies(trendingMoviesData.results.map(item => convertTMDBToMovie(item, 'movie')));
      setTrendingTV(trendingTVData.results.map(item => convertTMDBToMovie(item, 'tv')));
      setPopularMovies(popularMoviesData.results.map(item => convertTMDBToMovie(item, 'movie')));
      setPopularTV(popularTVData.results.map(item => convertTMDBToMovie(item, 'tv')));
    } catch (error) {
      console.error('Error loading new and popular:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="px-4 md:px-12 mb-8">
        <h1 className="text-white text-3xl md:text-4xl font-bold">New & Popular</h1>
      </div>

      <div className="relative">
        <MovieRow 
          title="Trending Movies"
          movies={trendingMovies}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Trending TV Shows"
          movies={trendingTV}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Popular Movies"
          movies={popularMovies}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Popular TV Shows"
          movies={popularTV}
          onOpenModal={handleOpenModal}
        />
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

export default NewAndPopularPage;