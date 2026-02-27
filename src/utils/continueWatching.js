const CONTINUE_WATCHING_KEY = 'netflix_continue_watching';

// Get all continue watching items
export const getContinueWatching = () => {
  try {
    const data = localStorage.getItem(CONTINUE_WATCHING_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading continue watching:', error);
    return [];
  }
};

// Add or update continue watching item
export const addToContinueWatching = (movieId, progress, timestamp) => {
  try {
    const items = getContinueWatching();
    const existingIndex = items.findIndex(item => item.movieId === movieId);
    
    const newItem = {
      movieId,
      progress, // percentage (0-100)
      timestamp, // current time in seconds
      lastWatched: new Date().toISOString()
    };
    
    if (existingIndex !== -1) {
      items[existingIndex] = newItem;
    } else {
      items.unshift(newItem); // Add to beginning
    }
    
    // Keep only last 10 items
    const limitedItems = items.slice(0, 10);
    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(limitedItems));
    return true;
  } catch (error) {
    console.error('Error adding to continue watching:', error);
    return false;
  }
};

// Remove from continue watching
export const removeFromContinueWatching = (movieId) => {
  try {
    const items = getContinueWatching();
    const filtered = items.filter(item => item.movieId !== movieId);
    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from continue watching:', error);
    return false;
  }
};

// Get continue watching item for specific movie
export const getContinueWatchingItem = (movieId) => {
  const items = getContinueWatching();
  return items.find(item => item.movieId === movieId);
};