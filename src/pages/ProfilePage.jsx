import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaSignOutAlt, FaCrown, FaHeart, FaHistory, FaCog } from 'react-icons/fa';

function ProfilePage() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Mock profiles - in real app, this would come from context/API
  const profiles = [
    { id: 1, name: 'John', avatar: 'https://i.pravatar.cc/150?img=12', isPrimary: true },
    { id: 2, name: 'Kids', avatar: 'https://i.pravatar.cc/150?img=15', isKids: true },
    { id: 3, name: 'Guest', avatar: 'https://i.pravatar.cc/150?img=20', isPrimary: false }
  ];

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    // Simulate profile switch
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleManageProfiles = () => {
    alert('Navigate to profile management page');
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItMnptMC0yaDJ2Mmgtdi0yem0wIDBoLTJ2Mmgydi0yem0wIDBoMnYtMmgtdjJ6bTAgMGgydjJoLTJ2LTJ6bTAtMmgtMnYtMmgydjJ6bTAtMmgtMnYyaDJ2LTJ6bTAgMGgydi0yaC0ydjJ6bTAtMmgydi0yaC0ydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 slide-in">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            Who's watching?
          </h1>
          <p className="text-gray-400 text-lg">
            Select your profile to continue
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className="flex flex-col items-center cursor-pointer group scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleSelectProfile(profile)}
            >
              <div className="relative mb-4">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-white transition-all duration-300 transform group-hover:scale-110 shadow-2xl">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  {profile.isPrimary && (
                    <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1">
                      <FaCrown className="text-white text-xs" />
                    </div>
                  )}
                  {profile.isKids && (
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent flex items-end justify-center pb-2">
                      <span className="text-white text-xs font-bold">KIDS</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
                    <FaEdit className="text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-white text-lg md:text-xl font-semibold group-hover:text-gray-300 transition-colors">
                {profile.name}
              </h3>
            </div>
          ))}

          {/* Add Profile */}
          <div
            className="flex flex-col items-center cursor-pointer group scale-in"
            style={{ animationDelay: `${profiles.length * 100}ms` }}
            onClick={() => alert('Add new profile')}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg border-4 border-dashed border-gray-700 group-hover:border-white transition-all duration-300 flex items-center justify-center mb-4 transform group-hover:scale-110 bg-black/50">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-red-600 transition-colors duration-300 flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-3xl font-light">+</span>
                </div>
              </div>
            </div>
            <h3 className="text-gray-400 text-lg md:text-xl font-semibold group-hover:text-white transition-colors">
              Add Profile
            </h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={handleManageProfiles}
            className="px-6 py-3 border-2 border-gray-700 text-gray-400 hover:border-white hover:text-white transition-all duration-300 rounded font-semibold flex items-center gap-2"
          >
            <FaCog />
            Manage Profiles
          </button>
          
          <button
            onClick={() => navigate('/my-list')}
            className="px-6 py-3 border-2 border-gray-700 text-gray-400 hover:border-white hover:text-white transition-all duration-300 rounded font-semibold flex items-center gap-2"
          >
            <FaHeart />
            My List
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 border-2 border-gray-700 text-gray-400 hover:border-white hover:text-white transition-all duration-300 rounded font-semibold flex items-center gap-2"
          >
            <FaHistory />
            Continue Watching
          </button>
        </div>

        {/* Sign Out */}
        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-white transition-colors duration-300 font-semibold flex items-center gap-2 mx-auto"
          >
            <FaSignOutAlt />
            Sign out of Netflixy
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Profile Selection Animation */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center">
            <img
              src={selectedProfile.avatar}
              alt={selectedProfile.name}
              className="w-32 h-32 rounded-lg mx-auto mb-4 animate-pulse"
            />
            <h2 className="text-white text-2xl font-bold">
              Welcome back, {selectedProfile.name}!
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;