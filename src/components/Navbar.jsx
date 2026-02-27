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
  const [hasNotifications, setHasNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    if (!showNotifications) {
      setTimeout(() => setHasNotifications(false), 1000);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-[rgba(20,20,20,0.95)] backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        
        <div className="flex items-center gap-4 md:gap-8">
          {/* Netflixy Logo */}
          <Link to="/" className="group">
            <h1 className="netflixy-logo text-red-600 text-2xl md:text-3xl font-bold cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]">
              NETFLIXY
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-6 text-sm">
            {[
              { path: '/', label: 'Home' },
              { path: '/tv-shows', label: 'TV Shows' },
              { path: '/movies', label: 'Movies' },
              { path: '/new-and-popular', label: 'New & Popular' },
              { path: '/my-list', label: 'My List' },
              { path: '/browse', label: 'Browse' }
            ].map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`relative ${
                    isActive(item.path) ? 'text-white font-bold' : 'text-gray-300'
                  } hover:text-gray-200 transition-all duration-300 group`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
                    isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-xl hover:text-red-600 transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Search */}
          <div className="relative">
            {showSearchBar ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center scale-in">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="bg-black/80 backdrop-blur-sm border border-white/30 text-white px-4 py-2 pr-10 w-60 outline-none rounded-sm focus:ring-2 focus:ring-red-600 transition-all"
                  autoFocus
                />
                <FaTimes 
                  className="absolute right-3 text-white cursor-pointer hover:text-red-600 transition-colors"
                  onClick={() => {
                    setShowSearchBar(false);
                    setSearchQuery('');
                  }}
                />
              </form>
            ) : (
              <button 
                className="text-white text-lg md:text-xl hover:text-red-600 transition-all duration-300 transform hover:scale-110"
                onClick={() => setShowSearchBar(true)}
              >
                <FaSearch />
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="relative notification-menu">
            <div className="relative">
              <button
                className={`hidden md:block text-white text-xl transition-all duration-300 transform hover:scale-110 hover:text-red-600 ${
                  showNotifications ? 'text-red-600' : ''
                }`}
                onClick={toggleNotifications}
              >
                <FaBell />
                {hasNotifications && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse font-bold">
                    3
                  </span>
                )}
              </button>
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 bg-black/95 backdrop-blur-md border border-gray-800 py-2 w-80 max-h-96 overflow-y-auto rounded-lg shadow-2xl scale-in">
                <div className="px-4 py-3 border-b border-gray-800">
                  <h3 className="text-white font-bold">Notifications</h3>
                </div>
                
                {[
                  { title: 'New episode available', subtitle: 'Stranger Things S5 E1', time: '2 hours ago' },
                  { title: 'Now in your list', subtitle: 'The Witcher Season 3', time: '1 day ago' },
                  { title: 'Recommended for you', subtitle: 'Check out Money Heist', time: '3 days ago' }
                ].map((notif, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-white/10 cursor-pointer transition-all">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center font-bold text-white flex-shrink-0">
                        {notif.title[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{notif.title}</p>
                        <p className="text-gray-400 text-xs truncate">{notif.subtitle}</p>
                        <p className="text-gray-500 text-xs mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="px-4 py-3 border-t border-gray-800 text-center">
                  <button className="text-gray-400 hover:text-white text-sm transition-colors font-semibold">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-menu">
            <button 
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
              }}
            >
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Profile"
                className="w-7 h-7 md:w-8 md:h-8 rounded transition-all duration-300 group-hover:ring-2 group-hover:ring-red-600"
              />
              <FaCaretDown className={`text-white transition-all duration-300 ${
                showProfileMenu ? 'rotate-180 text-red-600' : 'group-hover:text-red-600'
              }`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-14 bg-black/95 backdrop-blur-md border border-gray-800 py-2 w-52 rounded-lg shadow-2xl scale-in">
                <Link 
                  to="/profile"
                  className="px-4 py-3 text-white text-sm hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-all"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <img src="https://i.pravatar.cc/150?img=12" alt="" className="w-8 h-8 rounded" />
                  <span className="font-semibold">User Name</span>
                </Link>

                <div className="px-4 py-2 text-white text-sm hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-all">
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded flex items-center justify-center">
                    <FaBars className="text-gray-400" />
                  </div>
                  <span>Manage Profiles</span>
                </div>

                <hr className="border-gray-800 my-2" />

                <div className="px-4 py-2 text-white text-sm hover:bg-white/10 cursor-pointer transition-all">
                  Account
                </div>
                <div className="px-4 py-2 text-white text-sm hover:bg-white/10 cursor-pointer transition-all">
                  Help Center
                </div>

                <hr className="border-gray-800 my-2" />

                <div className="px-4 py-2 text-white text-sm hover:bg-red-600 cursor-pointer text-center font-semibold transition-all">
                  Sign out of Netflixy
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden bg-black/95 backdrop-blur-md border-t border-gray-800 slide-in">
          <ul className="px-4 py-4 space-y-4">
            {[
              { path: '/', label: 'Home' },
              { path: '/tv-shows', label: 'TV Shows' },
              { path: '/movies', label: 'Movies' },
              { path: '/new-and-popular', label: 'New & Popular' },
              { path: '/my-list', label: 'My List' },
              { path: '/browse', label: 'Browse' }
            ].map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`${
                    isActive(item.path) ? 'text-red-600 font-bold' : 'text-gray-300'
                  } hover:text-red-600 transition-all block`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;