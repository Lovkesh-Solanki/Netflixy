import { useState, useEffect } from 'react';
import { tmdbApi, convertTMDBToMovie } from '../utils/tmdbApi';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';

function TVShowsPage() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [airingToday, setAiringToday] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTVShows();
  }, []);

  const loadTVShows = async () => {
    try {
      setLoading(true);
      const [trendingData, popularData, topRatedData, airingData] = await Promise.all([
        tmdbApi.getTrendingTVShows(),
        tmdbApi.getPopularTVShows(),
        tmdbApi.getTopRatedTVShows(),
        tmdbApi.getAiringTodayTVShows()
      ]);

      setTrending(trendingData.results.map(item => convertTMDBToMovie(item, 'tv')));
      setPopular(popularData.results.map(item => convertTMDBToMovie(item, 'tv')));
      setTopRated(topRatedData.results.map(item => convertTMDBToMovie(item, 'tv')));
      setAiringToday(airingData.results.map(item => convertTMDBToMovie(item, 'tv')));
    } catch (error) {
      console.error('Error loading TV shows:', error);
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
        <div className="text-white text-2xl">Loading TV Shows...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="px-4 md:px-12 mb-8">
        <h1 className="text-white text-3xl md:text-4xl font-bold">TV Shows</h1>
      </div>

      <div className="relative">
        <MovieRow 
          title="Trending Now"
          movies={trending}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Popular on Netflix"
          movies={popular}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Top Rated"
          movies={topRated}
          onOpenModal={handleOpenModal}
        />
        <MovieRow 
          title="Airing Today"
          movies={airingToday}
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

export default TVShowsPage;