import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMoviesByGenre, getAllGenres } from '../data/mockData';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';

function GenrePage() {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [allGenres, setAllGenres] = useState([]);

  useEffect(() => {
    setAllGenres(getAllGenres());
  }, []);

  useEffect(() => {
    if (genre) {
      const filteredMovies = getMoviesByGenre(genre);
      setMovies(filteredMovies);
    }
  }, [genre]);

  const handleGenreChange = (newGenre) => {
    navigate(`/genre/${newGenre}`);
  };

  const handleOpenModal = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="px-4 md:px-12">
        {/* Genre Selector */}
        <div className="mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Browse by Genre
          </h1>
          
          <div className="flex flex-wrap gap-3">
            {allGenres.map((g) => (
              <button
                key={g}
                onClick={() => handleGenreChange(g)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  g.toLowerCase() === genre?.toLowerCase()
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No movies found in this genre</p>
          </div>
        ) : (
          <>
            <h2 className="text-white text-2xl font-bold mb-6">
              {genre} ({movies.length} {movies.length === 1 ? 'title' : 'titles'})
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

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default GenrePage;