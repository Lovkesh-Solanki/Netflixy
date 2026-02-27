import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyList, removeFromMyList } from '../utils/LocalStorage';
import { tmdbApi } from '../utils/tmdbApi';
import { FaPlay, FaTrash } from 'react-icons/fa';
import { getPlaceholderImage } from '../utils/placeholderImage';

function MyListPage() {
  const navigate = useNavigate();
  const [myListMovies, setMyListMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      
      console.log('My List IDs from localStorage:', myListIds);
      
      if (myListIds.length === 0) {
        setMyListMovies([]);
        setIsLoading(false);
        return;
      }

      const moviePromises = myListIds.map(async (id) => {
        try {
          const movie = await tmdbApi.getMovieDetails(id);
          
          // Check if movie data is valid
          if (!movie || movie.status_code === 34) {
            console.warn(`Movie ${id} not found on TMDB (404)`);
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
          // Remove invalid ID from localStorage
          removeFromMyList(id);
          return null;
        }
      });

      const moviesData = await Promise.all(moviePromises);
      const validMovies = moviesData.filter(movie => movie !== null);
      
      console.log('Fetched movies:', validMovies.length);
      setMyListMovies(validMovies);
    } catch (error) {
      console.error('Error loading My List:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromList = (movieId, e) => {
    e.stopPropagation();
    const scrollY = window.scrollY;
    
    removeFromMyList(movieId);
    window.dispatchEvent(new Event('myListUpdated'));
    loadMyList();
    
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  const handlePlayMovie = (movieId, e) => {
    e.stopPropagation();
    const scrollY = window.scrollY;
    navigate(`/movie/${movieId}`);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  const handleMovieClick = (movieId) => {
    const scrollY = window.scrollY;
    navigate(`/movie/${movieId}`);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-black">
        <div className="px-4 md:px-12">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">
            My List
          </h1>
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="px-4 md:px-12">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
          My List
        </h1>
        <p className="text-gray-400 mb-8">
          {myListMovies.length} {myListMovies.length === 1 ? 'title' : 'titles'}
        </p>

        {myListMovies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">Your list is empty</p>
            <p className="text-gray-500 mb-8">Add movies and shows to your list to watch them later</p>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition"
            >
              Browse Content
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {myListMovies.map((movie) => (
              <div
                key={movie.id}
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

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => handlePlayMovie(movie.id, e)}
                      className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition"
                      title="Play"
                    >
                      <FaPlay className="text-sm" />
                    </button>

                    <button
                      onClick={(e) => handleRemoveFromList(movie.id, e)}
                      className="bg-gray-800 text-white rounded-full p-3 hover:bg-gray-700 transition border-2 border-white"
                      title="Remove from My List"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>

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
        )}
      </div>
    </div>
  );
}

export default MyListPage;




