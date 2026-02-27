import { useState, useEffect } from 'react';
import { tmdbApi, convertTMDBToMovie } from '../utils/tmdbApi';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';

function MoviesPage() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [trendingData, popularData, topRatedData, nowPlayingData, upcomingData] = await Promise.all([
        tmdbApi.getTrendingMovies(),
        tmdbApi.getPopularMovies(),
        tmdbApi.getTopRatedMovies(),
        tmdbApi.getNowPlayingMovies(),
        tmdbApi.getUpcomingMovies()
      ]);

      setTrending(trendingData.results.map(item => convertTMDBToMovie(item, 'movie')));
      setPopular(popularData.results.map(item => convertTMDBToMovie(item, 'movie')));
      setTopRated(topRatedData.results.map(item => convertTMDBToMovie(item, 'movie')));
      setNowPlaying(nowPlayingData.results.map(item => convertTMDBToMovie(item, 'movie')));
      setUpcoming(upcomingData.results.map(item => convertTMDBToMovie(item, 'movie')));
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-white text-2xl">Loading Movies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="px-4 md:px-12 mb-8">
        <h1 className="text-white text-3xl md:text-4xl font-bold">Movies</h1>
      </div>

      <div className="relative">
        <MovieRow 
          title="Trending Now"
          movies={trending}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Popular on Netflixy"
          movies={popular}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Top Rated"
          movies={topRated}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Now Playing"
          movies={nowPlaying}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Upcoming"
          movies={upcoming}
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

export default MoviesPage;