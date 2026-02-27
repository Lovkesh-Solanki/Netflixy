import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TVShowsPage from './pages/TVshowsPage';
import MoviesPage from './pages/MoviesPage';
import NewAndPopularPage from './pages/NewAndPopularPage';
import BrowsePage from './pages/BrowsePage';
import MyListPage from './pages/MyListPage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="bg-black min-h-screen">
        {/* Persistent Navbar - Hidden on Profile Page */}
        <Routes>
          <Route path="/profile" element={null} />
          <Route path="*" element={<Navbar />} />
        </Routes>
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tv-shows" element={<TVShowsPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/new-and-popular" element={<NewAndPopularPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        
        {/* Persistent Footer - Hidden on Profile Page */}
        <Routes>
          <Route path="/profile" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;