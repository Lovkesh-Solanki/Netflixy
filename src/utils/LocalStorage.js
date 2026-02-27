// LocalStorage utility functions for Netflix Clone

const MY_LIST_KEY = 'netflix_my_list';
const FAVORITES_KEY = 'netflix_favorites';
const CONTINUE_WATCHING_KEY = 'netflix_continue_watching';

// ==================== MY LIST FUNCTIONS ====================

// Get My List from localStorage
export const getMyList = () => {
  try {
    const list = localStorage.getItem(MY_LIST_KEY);
    return list ? JSON.parse(list) : [];
  } catch (error) {
    console.error('Error reading My List:', error);
    return [];
  }
};

// Add movie to My List
export const addToMyList = (movieId) => {
  try {
    const list = getMyList();
    if (!list.includes(movieId)) {
      list.push(movieId);
      localStorage.setItem(MY_LIST_KEY, JSON.stringify(list));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('myListUpdated'));
      
      console.log('Added to My List:', movieId, 'Current list:', list);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to My List:', error);
    return false;
  }
};

// Remove movie from My List
export const removeFromMyList = (movieId) => {
  try {
    const list = getMyList();
    const newList = list.filter(id => id !== movieId);
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(newList));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('myListUpdated'));
    
    console.log('Removed from My List:', movieId, 'Current list:', newList);
    return true;
  } catch (error) {
    console.error('Error removing from My List:', error);
    return false;
  }
};

// Check if movie is in My List
export const isInMyList = (movieId) => {
  const list = getMyList();
  return list.includes(movieId);
};

// Clear entire My List
export const clearMyList = () => {
  try {
    localStorage.removeItem(MY_LIST_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing My List:', error);
    return false;
  }
};

// ==================== FAVORITES FUNCTIONS ====================

// Get Favorites from localStorage
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading Favorites:', error);
    return [];
  }
};

// Add movie to Favorites
export const addToFavorites = (movieId) => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to Favorites:', error);
    return false;
  }
};

// Remove movie from Favorites
export const removeFromFavorites = (movieId) => {
  try {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(id => id !== movieId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return true;
  } catch (error) {
    console.error('Error removing from Favorites:', error);
    return false;
  }
};

// Check if movie is in Favorites
export const isFavorite = (movieId) => {
  const favorites = getFavorites();
  return favorites.includes(movieId);
};

// ==================== CONTINUE WATCHING FUNCTIONS ====================

// Get Continue Watching data
export const getContinueWatching = () => {
  try {
    const data = localStorage.getItem(CONTINUE_WATCHING_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading Continue Watching:', error);
    return [];
  }
};

// Add or update Continue Watching entry
export const updateContinueWatching = (movieId, progress, timestamp = Date.now()) => {
  try {
    let continueWatching = getContinueWatching();
    
    // Check if movie already exists
    const existingIndex = continueWatching.findIndex(item => item.movieId === movieId);
    
    if (existingIndex !== -1) {
      // Update existing entry
      continueWatching[existingIndex] = { movieId, progress, timestamp };
    } else {
      // Add new entry
      continueWatching.push({ movieId, progress, timestamp });
    }
    
    // Sort by timestamp (most recent first) and keep only last 20
    continueWatching.sort((a, b) => b.timestamp - a.timestamp);
    continueWatching = continueWatching.slice(0, 20);
    
    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(continueWatching));
    return true;
  } catch (error) {
    console.error('Error updating Continue Watching:', error);
    return false;
  }
};

// Remove from Continue Watching
export const removeFromContinueWatching = (movieId) => {
  try {
    const continueWatching = getContinueWatching();
    const filtered = continueWatching.filter(item => item.movieId !== movieId);
    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from Continue Watching:', error);
    return false;
  }
};

// Get progress for a specific movie
export const getMovieProgress = (movieId) => {
  const continueWatching = getContinueWatching();
  const movie = continueWatching.find(item => item.movieId === movieId);
  return movie ? movie.progress : 0;
};