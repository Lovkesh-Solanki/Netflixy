// TMDB API Configuration
const API_KEY = '9f7e49c70a35d54ccb4a1e489013fce9'; // Replace with your actual key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const IMAGE_SIZES = {
  poster: '/w500',
  backdrop: '/original',
  profile: '/w185'
};

// Helper function to build image URL
export const getImageUrl = (path, size = IMAGE_SIZES.backdrop) => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}${size}${path}`;
};

// Fetch trending movies/shows
export const getTrending = async (mediaType = 'all', timeWindow = 'week') => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
};

// Fetch popular movies
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

// Fetch popular TV shows
export const getPopularTVShows = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return [];
  }
};

// Fetch movies by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
};

// Fetch top rated movies
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

// Fetch Netflix Originals (using genre/network filter)
export const getNetflixOriginals = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching Netflix Originals:', error);
    return [];
  }
};

// Fetch action movies
export const getActionMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching action movies:', error);
    return [];
  }
};

// Fetch comedy movies
export const getComedyMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching comedy movies:', error);
    return [];
  }
};

// Fetch horror movies
export const getHorrorMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching horror movies:', error);
    return [];
  }
};

// Fetch romance movies
export const getRomanceMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching romance movies:', error);
    return [];
  }
};

// Fetch documentaries
export const getDocumentaries = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching documentaries:', error);
    return [];
  }
};

// Search movies and TV shows
export const searchMulti = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
};

// Get movie details
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits,similar`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Get TV show details
export const getTVShowDetails = async (tvId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=videos,credits,similar`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    return null;
  }
};

// Get movie/show videos (trailers)
export const getVideos = async (id, type = 'movie') => {
  try {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

// Get all genre list
export const getGenres = async (type = 'movie') => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

// Convert TMDB data to our app format
export const convertToAppFormat = (tmdbItem) => {
  const isMovie = tmdbItem.media_type === 'movie' || tmdbItem.title;
  
  return {
    id: tmdbItem.id,
    title: isMovie ? tmdbItem.title : tmdbItem.name,
    image: getImageUrl(tmdbItem.poster_path, IMAGE_SIZES.poster),
    banner: getImageUrl(tmdbItem.backdrop_path, IMAGE_SIZES.backdrop),
    description: tmdbItem.overview,
    year: isMovie 
      ? new Date(tmdbItem.release_date).getFullYear() 
      : new Date(tmdbItem.first_air_date).getFullYear(),
    rating: tmdbItem.vote_average ? `${(tmdbItem.vote_average * 10).toFixed(0)}%` : 'N/A',
    match: tmdbItem.vote_average ? Math.round(tmdbItem.vote_average * 10) : 75,
    genres: tmdbItem.genre_ids || [],
    isMovie: isMovie,
    tmdbId: tmdbItem.id
  };
};