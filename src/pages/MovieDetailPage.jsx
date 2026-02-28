import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMovieDetails, getTVShowDetails, getImageUrl, IMAGE_SIZES } from '../services/tmdbApi';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaChevronLeft } from 'react-icons/fa';
import { isInMyList, addToMyList, removeFromMyList } from '../utils/LocalStorage';
import VideoPlayer from '../components/VideoPlayer';

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inMyList, setInMyList] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    setLoading(true);
    try {
      // Try movie first, then TV show
      let data = await getMovieDetails(id);
      
      if (!data || data.success === false) {
        data = await getTVShowDetails(id);
      }

      if (data && data.id) {
        // Format the data
        const formattedMovie = {
          id: data.id,
          title: data.title || data.name,
          banner: getImageUrl(data.backdrop_path, IMAGE_SIZES.backdrop),
          image: getImageUrl(data.poster_path, IMAGE_SIZES.poster),
          description: data.overview,
          year: data.release_date ? new Date(data.release_date).getFullYear() : 
                data.first_air_date ? new Date(data.first_air_date).getFullYear() : 'N/A',
          rating: data.vote_average ? `${(data.vote_average * 10).toFixed(0)}%` : 'N/A',
          match: data.vote_average ? Math.round(data.vote_average * 10) : 75,
          genres: data.genres ? data.genres.map(g => g.name) : [],
          cast: data.credits?.cast ? data.credits.cast.slice(0, 5).map(c => c.name) : [],
          seasons: data.number_of_seasons || null,
          duration: data.runtime ? `${data.runtime} min` : null,
          tags: data.genres ? data.genres.slice(0, 3).map(g => g.name) : [],
          trailer: data.videos?.results?.[0] ? `https://www.youtube.com/embed/${data.videos.results[0].key}` : null
        };

        setMovie(formattedMovie);
        setInMyList(isInMyList(data.id));
      } else {
        setMovie(null);
      }
    } catch (error) {
      console.error('Error loading movie details:', error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMyList = () => {
    if (inMyList) {
      removeFromMyList(movie.id);
      setInMyList(false);
    } else {
      addToMyList(movie.id);
      setInMyList(true);
    }
  };

  const handlePlayMovie = () => {
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold mb-4">Movie Not Found</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-500 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-24 left-4 md:left-12 z-40 bg-black/70 hover:bg-black text-white rounded-full p-3 transition"
        >
          <FaChevronLeft className="text-xl" />
        </button>

        {/* Hero Section */}
        <div className="relative w-full h-[70vh] md:h-[80vh]">
          <img 
            src={movie.banner} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              {movie.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 text-white">
              <span className="text-green-500 font-bold text-xl">{movie.match}% Match</span>
              <span className="text-gray-300">{movie.year}</span>
              {movie.rating && <span className="border border-gray-400 px-2 py-0.5 text-sm">{movie.rating}</span>}
              {movie.seasons && <span className="text-gray-300">{movie.seasons} Season{movie.seasons > 1 ? 's' : ''}</span>}
              {movie.duration && <span className="text-gray-300">{movie.duration}</span>}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold text-lg hover:bg-gray-200 transition"
                onClick={handlePlayMovie}
              >
                <FaPlay />
                <span>Play</span>
              </button>
              
              <button 
                className="flex items-center gap-2 bg-gray-700/80 hover:bg-gray-600 text-white px-6 py-3 rounded font-bold transition"
                onClick={handleToggleMyList}
              >
                {inMyList ? <FaCheck /> : <FaPlus />}
                <span>{inMyList ? 'In My List' : 'Add to List'}</span>
              </button>
              
              <button 
                className="flex items-center justify-center bg-gray-700/80 hover:bg-gray-600 text-white rounded-full w-12 h-12 transition"
              >
                <FaThumbsUp />
              </button>
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        {movie.trailer && (
          <div className="px-6 md:px-12 py-10">
            <h2 className="text-white text-2xl font-bold mb-4">Related video</h2>
            <div className="aspect-video max-w-4xl">
              <iframe 
                width="100%" 
                height="100%" 
                src={movie.trailer}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="px-6 md:px-12 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl">
            {/* Main Content */}
            <div className="md:col-span-2">
              <p className="text-white text-lg leading-relaxed mb-8">
                {movie.description}
              </p>
            </div>

            {/* Side Info */}
            <div className="space-y-4 text-sm">
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="text-gray-400">Cast: </span>
                  <span className="text-white">{movie.cast.join(', ')}</span>
                </div>
              )}
              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <span className="text-gray-400">Genres: </span>
                  <span className="text-white">{movie.genres.join(', ')}</span>
                </div>
              )}
              {movie.tags && movie.tags.length > 0 && (
                <div>
                  <span className="text-gray-400">This {movie.seasons ? 'show' : 'movie'} is: </span>
                  <span className="text-white">{movie.tags.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      {showPlayer && (
        <VideoPlayer 
          movie={movie}
          onClose={handleClosePlayer}
        />
      )}
    </>
  );
}

export default MovieDetailPage;









