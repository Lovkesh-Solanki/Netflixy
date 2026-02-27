const API_KEY = '9f7e49c70a35d54ccb4a1e489013fce9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = {
  getTrendingMovies: async (timeWindow = 'week') => {
    const response = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`);
    return response.json();
  },

  getTrendingTVShows: async (timeWindow = 'week') => {
    const response = await fetch(`${BASE_URL}/trending/tv/${timeWindow}?api_key=${API_KEY}`);
    return response.json();
  },

  getPopularMovies: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    return response.json();
  },

  getPopularTVShows: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
    return response.json();
  },

  getTopRatedMovies: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`);
    return response.json();
  },

  getTopRatedTVShows: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=${page}`);
    return response.json();
  },

  getMovieDetails: async (movieId) => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`);
    return response.json();
  },

  getTVShowDetails: async (tvId) => {
    const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=credits,videos`);
    return response.json();
  },

  searchMovies: async (query, page = 1) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    return response.json();
  },

  searchTVShows: async (query, page = 1) => {
    const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    return response.json();
  },

  multiSearch: async (query, page = 1) => {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    return response.json();
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
    return response.json();
  },

  getTVShowsByGenre: async (genreId, page = 1) => {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
    return response.json();
  },

  getMovieGenres: async () => {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return response.json();
  },

  getTVGenres: async () => {
    const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
    return response.json();
  },

  getNowPlayingMovies: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`);
    return response.json();
  },

  getUpcomingMovies: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`);
    return response.json();
  },

  getAiringTodayTVShows: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}&page=${page}`);
    return response.json();
  },

  getOnTheAirTVShows: async (page = 1) => {
    const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&page=${page}`);
    return response.json();
  },

  // NEW: Get videos (trailers, teasers, etc.)
  getVideos: async (id, type = 'movie') => {
    const response = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results || [];
  },

  getImageUrl: (path, size = 'w500') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getBackdropUrl: (path, size = 'original') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};

export const convertTMDBToMovie = (item, type = 'movie') => {
  return {
    id: item.id,
    title: type === 'movie' ? item.title : item.name,
    image: tmdbApi.getImageUrl(item.poster_path),
    banner: tmdbApi.getBackdropUrl(item.backdrop_path),
    year: type === 'movie' ? item.release_date?.split('-')[0] : item.first_air_date?.split('-')[0],
    rating: item.adult ? 'R' : 'PG-13',
    match: Math.round(item.vote_average * 10),
    description: item.overview,
    genres: item.genre_ids || [],
    type: type
  };
};