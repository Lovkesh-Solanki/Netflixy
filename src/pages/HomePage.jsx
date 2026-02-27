import { useState, useEffect } from 'react';
import { tmdbApi, convertTMDBToMovie } from '../utils/tmdbApi';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';

function HomePage() {
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomePageData();
  }, []);

  const loadHomePageData = async () => {
    try {
      setLoading(true);

      const [
        trendingMoviesData,
        trendingTVData,
        popularMoviesData,
        topRatedMoviesData
      ] = await Promise.all([
        tmdbApi.getTrendingMovies(),
        tmdbApi.getTrendingTVShows(),
        tmdbApi.getPopularMovies(),
        tmdbApi.getTopRatedMovies()
      ]);

      const trendingMoviesConverted = trendingMoviesData.results.map(item => 
        convertTMDBToMovie(item, 'movie')
      );
      const trendingTVConverted = trendingTVData.results.map(item => 
        convertTMDBToMovie(item, 'tv')
      );
      const popularMoviesConverted = popularMoviesData.results.map(item => 
        convertTMDBToMovie(item, 'movie')
      );
      const topRatedMoviesConverted = topRatedMoviesData.results.map(item => 
        convertTMDBToMovie(item, 'movie')
      );

      if (trendingMoviesConverted.length > 0) {
        setHeroMovie(trendingMoviesConverted[0]);
      }

      setTrendingMovies(trendingMoviesConverted);
      setTrendingTV(trendingTVConverted);
      setPopularMovies(popularMoviesConverted);
      setTopRatedMovies(topRatedMoviesConverted);
    } catch (error) {
      console.error('Error loading home page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (movie) => {
    const scrollY = window.scrollY;
    setSelectedMovie(movie);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  const handleCloseModal = () => {
    const scrollY = window.scrollY;
    setSelectedMovie(null);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Netflixy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black">
      {heroMovie && <Hero movie={heroMovie} />}
      
      <div className="relative z-20 -mt-32">
        {trendingMovies.length > 0 && (
          <MovieRow 
            title="Trending Now"
            movies={trendingMovies}
            onOpenModal={handleOpenModal}
          />
        )}

        {trendingTV.length > 0 && (
          <MovieRow 
            title="Trending TV Shows"
            movies={trendingTV}
            onOpenModal={handleOpenModal}
          />
        )}

        {popularMovies.length > 0 && (
          <MovieRow 
            title="Popular on Netflixy"
            movies={popularMovies}
            onOpenModal={handleOpenModal}
          />
        )}

        {topRatedMovies.length > 0 && (
          <MovieRow 
            title="Top Rated"
            movies={topRatedMovies}
            onOpenModal={handleOpenModal}
          />
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

export default HomePage;