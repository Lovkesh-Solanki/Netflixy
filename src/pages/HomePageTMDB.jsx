import { useState, useEffect } from 'react';
import { 
  getTrending,
  getPopularMovies,
  getNetflixOriginals,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getDocumentaries,
  getTopRatedMovies,
  convertToAppFormat
} from '../services/tmdbApi';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import ContinueWatchingRow from '../components/ContinueWatchingRow';
import MovieModal from '../components/MovieModal';

function HomePageTMDB() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieCategories, setMovieCategories] = useState({
    trending: [],
    netflixOriginals: [],
    topRated: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    documentaries: []
  });

  useEffect(() => {
    loadAllMovies();
  }, []);

  const loadAllMovies = async () => {
    setLoading(true);
    
    try {
      const [
        trending,
        netflixOriginals,
        topRated,
        action,
        comedy,
        horror,
        romance,
        documentaries
      ] = await Promise.all([
        getTrending('all', 'week'),
        getNetflixOriginals(),
        getTopRatedMovies(),
        getActionMovies(),
        getComedyMovies(),
        getHorrorMovies(),
        getRomanceMovies(),
        getDocumentaries()
      ]);

      setMovieCategories({
        trending: trending.map(convertToAppFormat),
        netflixOriginals: netflixOriginals.map(convertToAppFormat),
        topRated: topRated.map(convertToAppFormat),
        action: action.map(convertToAppFormat),
        comedy: comedy.map(convertToAppFormat),
        horror: horror.map(convertToAppFormat),
        romance: romance.map(convertToAppFormat),
        documentaries: documentaries.map(convertToAppFormat)
      });
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading Netflix...</div>
      </div>
    );
  }

  return (
    <div>
      <Hero movie={movieCategories.trending[0]} />
      
      <div className="relative z-20 pt-8">
        <ContinueWatchingRow />
        
        <MovieRow 
          title="Trending Now"
          movies={movieCategories.trending}
          onOpenModal={handleOpenModal}
        />
        
        <MovieRow 
          title="Netflix Originals"
          movies={movieCategories.netflixOriginals}
          onOpenModal={handleOpenModal}
        />
        
        <MovieRow 
          title="Top Rated"
          movies={movieCategories.topRated}
          onOpenModal={handleOpenModal}
        />
        
        <MovieRow 
          title="Action Movies"
          movies={movieCategories.action}
          onOpenModal={handleOpenModal}
        />
        
        <MovieRow 
          title="Comedies"
          movies={movieCategories.comedy}
          onOpenModal={handleOpenModal}
        />
        
        <MovieRow 
          title="Horror Movies"
          movies={movieCategories.horror}
          onOpenModal={handleOpenModal}
        />
        
        <MovieRow 
          title="Romantic Movies"
          movies={movieCategories.romance}
          onOpenModal={handleOpenModal}
        />
        
        <MovieRow 
          title="Documentaries"
          movies={movieCategories.documentaries}
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

export default HomePageTMDB;