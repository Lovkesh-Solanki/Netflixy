import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaBell, FaCaretDown, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // Toggle for notification indicator
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
      if (!e.target.closest('.notification-menu')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchBar(false);
      setSearchQuery('');
    }
  };

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    // Mark as read when opened
    if (!showNotifications) {
      setTimeout(() => setHasNotifications(false), 1000);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-black' : 'bg-gradient-to-b from-black to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        
        <div className="flex items-center gap-4 md:gap-8">
          {/* Netflix Logo */}
          <Link to="/">
            <h1 className="text-red-600 text-2xl md:text-3xl font-bold cursor-pointer hover:text-red-500 transition">
              NETFLIX
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-5 text-sm">
            <li>
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/tv-shows" 
                className={`${isActive('/tv-shows') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition`}
              >
                TV Shows
              </Link>
            </li>
            <li>
              <Link 
                to="/movies" 
                className={`${isActive('/movies') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition`}
              >
                Movies
              </Link>
            </li>
            <li>
              <Link 
                to="/new-and-popular" 
                className={`${isActive('/new-and-popular') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition`}
              >
                New & Popular
              </Link>
            </li>
            <li>
              <Link 
                to="/my-list" 
                className={`${isActive('/my-list') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition`}
              >
                My List
              </Link>
            </li>
            <li>
              <Link 
                to="/browse" 
                className={`${isActive('/browse') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition`}
              >
                Browse
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-xl"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-5">
          
          {/* Search */}
          <div className="relative">
            {showSearchBar ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="bg-black/80 border border-white text-white px-4 py-1 pr-10 w-60 outline-none"
                  autoFocus
                />
                <FaTimes 
                  className="absolute right-3 text-white cursor-pointer hover:text-gray-300"
                  onClick={() => {
                    setShowSearchBar(false);
                    setSearchQuery('');
                  }}
                />
              </form>
            ) : (
              <FaSearch 
                className="text-white text-lg md:text-xl cursor-pointer hover:text-gray-300 transition"
                onClick={() => setShowSearchBar(true)}
              />
            )}
          </div>

          {/* Notifications */}
          <div className="relative notification-menu">
            <div className="relative">
              <FaBell 
                className={`hidden md:block text-white text-xl cursor-pointer hover:text-gray-300 transition-all duration-300 ${
                  showNotifications ? 'scale-110' : ''
                }`}
                onClick={toggleNotifications}
              />
              {/* Notification Badge */}
              {hasNotifications && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  3
                </span>
              )}
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 bg-black/95 border-t-2 border-gray-700 py-2 w-80 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-700">
                  <h3 className="text-white font-bold">Notifications</h3>
                </div>
                
                {/* Sample Notifications */}
                <div className="px-4 py-3 hover:bg-gray-800 cursor-pointer transition">
                  <div className="flex gap-3">
                    <img src="https://via.placeholder.com/50" alt="" className="w-12 h-12 rounded" />
                    <div>
                      <p className="text-white text-sm">New episode available</p>
                      <p className="text-gray-400 text-xs">Stranger Things S5 E1</p>
                      <p className="text-gray-500 text-xs mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 hover:bg-gray-800 cursor-pointer transition">
                  <div className="flex gap-3">
                    <img src="https://via.placeholder.com/50" alt="" className="w-12 h-12 rounded" />
                    <div>
                      <p className="text-white text-sm">Now in your list</p>
                      <p className="text-gray-400 text-xs">The Witcher Season 3</p>
                      <p className="text-gray-500 text-xs mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 hover:bg-gray-800 cursor-pointer transition">
                  <div className="flex gap-3">
                    <img src="https://via.placeholder.com/50" alt="" className="w-12 h-12 rounded" />
                    <div>
                      <p className="text-white text-sm">Recommended for you</p>
                      <p className="text-gray-400 text-xs">Check out Money Heist</p>
                      <p className="text-gray-500 text-xs mt-1">3 days ago</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 border-t border-gray-700 text-center">
                  <button className="text-gray-400 hover:text-white text-sm transition">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-menu">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
              }}
            >
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Profile"
                className="w-7 h-7 md:w-8 md:h-8 rounded"
              />
              <FaCaretDown className={`text-white transition-transform duration-300 ${
                showProfileMenu ? 'rotate-180' : ''
              }`} />
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 top-14 bg-black/95 border-t-2 border-gray-700 py-2 w-52">
                {/* User Profile */}
                <Link 
                  to="/profile"
                  className="px-4 py-3 text-white text-sm hover:underline cursor-pointer flex items-center gap-3"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <img src="https://i.pravatar.cc/150?img=12" alt="" className="w-8 h-8 rounded" />
                  <span>User Name</span>
                </Link>

                {/* Manage Profiles */}
                <div className="px-4 py-2 text-white text-sm hover:underline cursor-pointer flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                    <FaBars className="text-gray-400" />
                  </div>
                  <span>Manage Profiles</span>
                </div>

                <hr className="border-gray-700 my-2" />

                <div className="px-4 py-2 text-white text-sm hover:underline cursor-pointer">
                  Account
                </div>
                <div className="px-4 py-2 text-white text-sm hover:underline cursor-pointer">
                  Help Center
                </div>

                <hr className="border-gray-700 my-2" />

                <div className="px-4 py-2 text-white text-sm hover:underline cursor-pointer text-center">
                  Sign out of Netflix
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden bg-black/95 border-t border-gray-800">
          <ul className="px-4 py-4 space-y-4">
            <li>
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition block`}
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/tv-shows" 
                className={`${isActive('/tv-shows') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition block`}
                onClick={() => setShowMobileMenu(false)}
              >
                TV Shows
              </Link>
            </li>
            <li>
              <Link 
                to="/movies" 
                className={`${isActive('/movies') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition block`}
                onClick={() => setShowMobileMenu(false)}
              >
                Movies
              </Link>
            </li>
            <li>
              <Link 
                to="/new-and-popular" 
                className={`${isActive('/new-and-popular') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition block`}
                onClick={() => setShowMobileMenu(false)}
              >
                New & Popular
              </Link>
            </li>
            <li>
              <Link 
                to="/my-list" 
                className={`${isActive('/my-list') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition block`}
                onClick={() => setShowMobileMenu(false)}
              >
                My List
              </Link>
            </li>
            <li>
              <Link 
                to="/browse" 
                className={`${isActive('/browse') ? 'text-white font-bold' : 'text-gray-300'} hover:text-gray-200 transition block`}
                onClick={() => setShowMobileMenu(false)}
              >
                Browse
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;