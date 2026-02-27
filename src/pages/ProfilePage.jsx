import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaLock, FaChild, FaCamera, FaUpload } from 'react-icons/fa';

// Netflix Profile Avatar Options
const AVATAR_OPTIONS = [
  { id: 1, url: 'https://i.pravatar.cc/150?img=12', icon: '👤', isCustom: false },
  { id: 2, url: 'https://i.pravatar.cc/150?img=45', icon: '👩', isCustom: false },
  { id: 3, url: 'https://i.pravatar.cc/150?img=33', icon: '👨', isCustom: false },
  { id: 4, url: 'https://i.pravatar.cc/150?img=20', icon: '👶', isCustom: false },
  { id: 5, url: 'https://i.pravatar.cc/150?img=65', icon: '🦸', isCustom: false },
  { id: 6, url: 'https://i.pravatar.cc/150?img=8', icon: '🎮', isCustom: false },
];

// Profile Colors
const PROFILE_COLORS = [
  { id: 1, name: 'Red', value: 'bg-red-600', border: 'border-red-600' },
  { id: 2, name: 'Blue', value: 'bg-blue-600', border: 'border-blue-600' },
  { id: 3, name: 'Green', value: 'bg-green-600', border: 'border-green-600' },
  { id: 4, name: 'Yellow', value: 'bg-yellow-600', border: 'border-yellow-600' },
  { id: 5, name: 'Purple', value: 'bg-purple-600', border: 'border-purple-600' },
  { id: 6, name: 'Pink', value: 'bg-pink-600', border: 'border-pink-600' },
];

// Language Options
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

// Maturity Ratings
const MATURITY_RATINGS = [
  { id: 1, label: 'Kids', value: 'kids', icon: '👶', desc: 'All ages' },
  { id: 2, label: 'Older', value: 'older-kids', icon: '🧒', desc: '7+' },
  { id: 3, label: 'Teens', value: 'teens', icon: '🧑', desc: '13+' },
  { id: 4, label: 'Adults', value: 'adults', icon: '👨', desc: '18+' },
];

function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profiles, setProfiles] = useState([
    { 
      id: 1, 
      name: 'User Name', 
      avatar: AVATAR_OPTIONS[0], 
      isKids: false,
      color: PROFILE_COLORS[1],
      language: LANGUAGES[0],
      maturityRating: MATURITY_RATINGS[3],
      autoPlayNext: true,
      autoPlayPreviews: true,
      isLocked: false,
      pin: '',
    },
    { 
      id: 2, 
      name: 'Jane', 
      avatar: AVATAR_OPTIONS[1], 
      isKids: false,
      color: PROFILE_COLORS[2],
      language: LANGUAGES[0],
      maturityRating: MATURITY_RATINGS[3],
      autoPlayNext: true,
      autoPlayPreviews: false,
      isLocked: false,
      pin: '',
    },
    { 
      id: 3, 
      name: 'Kids', 
      avatar: AVATAR_OPTIONS[3], 
      isKids: true,
      color: PROFILE_COLORS[3],
      language: LANGUAGES[0],
      maturityRating: MATURITY_RATINGS[0],
      autoPlayNext: true,
      autoPlayPreviews: false,
      isLocked: true,
      pin: '1234',
    },
  ]);

  const [isManaging, setIsManaging] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditProfile, setCurrentEditProfile] = useState(null);
  const [isNewProfile, setIsNewProfile] = useState(false);

  // Edit Form States
  const [editForm, setEditForm] = useState({
    name: '',
    avatar: null,
    color: null,
    language: null,
    maturityRating: null,
    isKids: false,
    autoPlayNext: true,
    autoPlayPreviews: true,
    isLocked: false,
    pin: '',
  });

  const handleSelectProfile = (profile) => {
    if (!isManaging) {
      if (profile.isLocked) {
        const enteredPin = prompt('Enter PIN:');
        if (enteredPin === profile.pin) {
          console.log('Selected profile:', profile.name);
          navigate('/');
        } else {
          alert('Incorrect PIN!');
        }
      } else {
        console.log('Selected profile:', profile.name);
        navigate('/');
      }
    }
  };

  const handleOpenEditModal = (e, profile) => {
    e.stopPropagation();
    setCurrentEditProfile(profile);
    setIsNewProfile(false);
    setEditForm({
      name: profile.name,
      avatar: profile.avatar,
      color: profile.color,
      language: profile.language,
      maturityRating: profile.maturityRating,
      isKids: profile.isKids,
      autoPlayNext: profile.autoPlayNext,
      autoPlayPreviews: profile.autoPlayPreviews,
      isLocked: profile.isLocked,
      pin: profile.pin,
    });
    setShowEditModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Read the file and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const customAvatar = {
          id: Date.now(),
          url: reader.result,
          icon: '📷',
          isCustom: true,
          fileName: file.name
        };
        setEditForm({ ...editForm, avatar: customAvatar });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = () => {
    if (!editForm.name.trim()) {
      alert('Please enter a profile name');
      return;
    }

    if (editForm.isLocked && !editForm.pin) {
      alert('Please set a PIN for locked profile');
      return;
    }

    if (isNewProfile) {
      // Add new profile
      setProfiles([...profiles, { ...currentEditProfile, ...editForm }]);
    } else {
      // Update existing profile
      setProfiles(profiles.map(p => 
        p.id === currentEditProfile.id 
          ? { ...p, ...editForm }
          : p
      ));
    }
    
    setShowEditModal(false);
    setCurrentEditProfile(null);
    setIsNewProfile(false);
  };

  const handleCancelEdit = () => {
    // If it's a new profile being added, don't add it
    if (isNewProfile) {
      console.log('Cancelled new profile creation');
    }
    
    setShowEditModal(false);
    setCurrentEditProfile(null);
    setIsNewProfile(false);
  };

  const handleDeleteProfile = (e, profileId) => {
    e.stopPropagation();
    if (profiles.length > 1) {
      if (window.confirm('Are you sure you want to delete this profile?')) {
        setProfiles(profiles.filter(p => p.id !== profileId));
      }
    } else {
      alert('You must have at least one profile');
    }
  };

  const handleAddProfile = () => {
    if (profiles.length >= 5) {
      alert('Maximum 5 profiles allowed');
      return;
    }

    const newProfile = {
      id: Date.now(),
      name: `Profile ${profiles.length + 1}`,
      avatar: AVATAR_OPTIONS[0],
      isKids: false,
      color: PROFILE_COLORS[0],
      language: LANGUAGES[0],
      maturityRating: MATURITY_RATINGS[3],
      autoPlayNext: true,
      autoPlayPreviews: true,
      isLocked: false,
      pin: '',
    };
    
    setCurrentEditProfile(newProfile);
    setIsNewProfile(true);
    setEditForm({
      name: newProfile.name,
      avatar: newProfile.avatar,
      color: newProfile.color,
      language: newProfile.language,
      maturityRating: newProfile.maturityRating,
      isKids: false,
      autoPlayNext: true,
      autoPlayPreviews: true,
      isLocked: false,
      pin: '',
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-4 overflow-hidden">
      <div className="w-full max-w-6xl">
        
        {/* Compact Header */}
        <div className="text-center mb-8">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold mb-2">NETFLIX</h1>
          <h2 className="text-white text-3xl md:text-5xl font-bold mb-2">
            {isManaging ? 'Manage Profiles' : "Who's watching?"}
          </h2>
        </div>

        {/* Profiles Grid - Compact */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
          {profiles.map((profile) => (
            <div 
              key={profile.id} 
              className={`text-center ${isManaging ? '' : 'cursor-pointer'} group`}
              onClick={() => handleSelectProfile(profile)}
            >
              <div className="relative mb-2">
                {/* Avatar - Smaller */}
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-4 ${
                  isManaging ? profile.color.border : 'border-transparent'
                } ${
                  !isManaging ? 'group-hover:border-white' : ''
                } transition-all duration-300 ${
                  !isManaging ? 'group-hover:scale-105' : ''
                }`}>
                  <img
                    src={profile.avatar.url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Profile Icon Overlay - Only show if not custom */}
                  {!profile.avatar.isCustom && (
                    <div className={`absolute top-1 left-1 ${profile.color.value} rounded-full w-6 h-6 flex items-center justify-center text-white text-sm`}>
                      {profile.avatar.icon}
                    </div>
                  )}

                  {/* Custom Badge */}
                  {profile.avatar.isCustom && (
                    <div className="absolute top-1 left-1 bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                      <FaCamera />
                    </div>
                  )}

                  {/* Kids Badge */}
                  {profile.isKids && (
                    <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-1">
                      <FaChild className="text-white text-xs" />
                    </div>
                  )}

                  {/* Lock Icon */}
                  {profile.isLocked && !isManaging && (
                    <div className="absolute bottom-1 right-1 bg-gray-900/90 rounded-full p-1">
                      <FaLock className="text-white text-xs" />
                    </div>
                  )}

                  {/* Maturity Rating Badge */}
                  <div className="absolute bottom-1 left-1 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-white text-xs font-bold">
                    {profile.maturityRating.desc}
                  </div>
                </div>

                {/* Manage Mode Buttons */}
                {isManaging && (
                  <div className="absolute inset-0 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => handleOpenEditModal(e, profile)}
                      className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition transform hover:scale-110"
                      title="Edit Profile"
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteProfile(e, profile.id)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition transform hover:scale-110"
                        title="Delete Profile"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Info - Compact */}
              <div>
                <p className={`text-white text-base md:text-lg font-medium ${
                  !isManaging ? 'group-hover:text-white/80' : ''
                } transition flex items-center justify-center gap-1`}>
                  {profile.name}
                  {profile.isLocked && <FaLock className="text-xs text-gray-400" />}
                </p>
                <p className="text-gray-400 text-xs">
                  {profile.language.flag}
                </p>
              </div>
            </div>
          ))}

          {/* Add New Profile Button - Compact */}
          {profiles.length < 5 && (
            <div 
              className="text-center cursor-pointer group"
              onClick={handleAddProfile}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-4 border-gray-600 group-hover:border-white transition-all duration-300 flex items-center justify-center bg-gray-800 group-hover:bg-gray-700 mb-2">
                <FaPlus className="text-gray-400 group-hover:text-white text-3xl md:text-4xl transition" />
              </div>
              <p className="text-gray-400 group-hover:text-white text-base md:text-lg font-medium transition">
                Add Profile
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => setIsManaging(!isManaging)}
            className="border-2 border-gray-600 text-gray-400 hover:border-white hover:text-white px-6 py-2 text-sm tracking-wider transition-all duration-300 uppercase"
          >
            {isManaging ? 'Done' : 'Manage'}
          </button>
        </div>

        {/* Edit Profile Modal - Compact & Single Page */}
        {showEditModal && currentEditProfile && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gray-900 z-10 flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-white text-2xl font-bold">Edit Profile</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-white text-3xl transition"
                >
                  ×
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Compact Grid Layout */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-4">
                  
                  {/* Avatar Selection with Upload Button - Compact */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-400 text-xs uppercase tracking-wider">
                        Avatar
                      </label>
                      <button
                        onClick={handleUploadClick}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs flex items-center gap-2 transition"
                      >
                        <FaUpload className="text-xs" />
                        Upload Custom
                      </button>
                    </div>
                    
                    {/* Show custom avatar preview if uploaded */}
                    {editForm.avatar?.isCustom && (
                      <div className="mb-3 p-3 bg-gray-800 rounded-lg border-2 border-purple-600">
                        <div className="flex items-center gap-3">
                          <img 
                            src={editForm.avatar.url} 
                            alt="Custom" 
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium flex items-center gap-2">
                              <FaCamera className="text-purple-500" />
                              Custom Avatar
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                              {editForm.avatar.fileName}
                            </p>
                          </div>
                          <button
                            onClick={() => setEditForm({ ...editForm, avatar: AVATAR_OPTIONS[0] })}
                            className="text-red-500 hover:text-red-400 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Default avatars grid */}
                    <div className="grid grid-cols-6 gap-2">
                      {AVATAR_OPTIONS.map((avatar) => (
                        <div
                          key={avatar.id}
                          onClick={() => setEditForm({ ...editForm, avatar })}
                          className={`cursor-pointer rounded-lg overflow-hidden border-3 ${
                            editForm.avatar?.id === avatar.id && !editForm.avatar?.isCustom ? 'border-white' : 'border-transparent'
                          } hover:border-gray-400 transition`}
                        >
                          <img src={avatar.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      💡 Upload your own image or select from defaults
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded outline-none border-2 border-gray-700 focus:border-white transition text-sm"
                      placeholder="Profile name"
                      maxLength={20}
                    />
                  </div>

                  {/* Color Selection - Compact */}
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                      Color
                    </label>
                    <div className="flex gap-2">
                      {PROFILE_COLORS.map((color) => (
                        <div
                          key={color.id}
                          onClick={() => setEditForm({ ...editForm, color })}
                          className={`w-10 h-10 ${color.value} rounded-full cursor-pointer border-3 ${
                            editForm.color?.id === color.id ? 'border-white scale-110' : 'border-transparent'
                          } hover:scale-110 transition-all`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Language - Compact */}
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">
                      Language
                    </label>
                    <select
                      value={editForm.language?.code}
                      onChange={(e) => {
                        const lang = LANGUAGES.find(l => l.code === e.target.value);
                        setEditForm({ ...editForm, language: lang });
                      }}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded outline-none border-2 border-gray-700 focus:border-white transition text-sm"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  
                  {/* Maturity Rating - Compact */}
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                      Maturity
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {MATURITY_RATINGS.map((rating) => (
                        <div
                          key={rating.id}
                          onClick={() => setEditForm({ ...editForm, maturityRating: rating, isKids: rating.value === 'kids' })}
                          className={`cursor-pointer bg-gray-800 rounded-lg p-2 border-2 ${
                            editForm.maturityRating?.id === rating.id ? 'border-white' : 'border-gray-700'
                          } hover:border-gray-500 transition text-center`}
                        >
                          <div className="text-2xl mb-1">{rating.icon}</div>
                          <p className="text-white text-xs font-medium">{rating.label}</p>
                          <p className="text-gray-400 text-xs">{rating.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Autoplay Settings - Compact */}
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                      Playback
                    </label>
                    <div className="space-y-2 bg-gray-800 p-3 rounded">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-white text-sm">Autoplay next</span>
                        <input
                          type="checkbox"
                          checked={editForm.autoPlayNext}
                          onChange={(e) => setEditForm({ ...editForm, autoPlayNext: e.target.checked })}
                          className="w-4 h-4 accent-red-600"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-white text-sm">Autoplay previews</span>
                        <input
                          type="checkbox"
                          checked={editForm.autoPlayPreviews}
                          onChange={(e) => setEditForm({ ...editForm, autoPlayPreviews: e.target.checked })}
                          className="w-4 h-4 accent-red-600"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Lock Profile - Compact */}
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                      Security
                    </label>
                    <div className="bg-gray-800 p-3 rounded space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="text-white text-sm font-medium flex items-center gap-2">
                            <FaLock className="text-xs" /> Lock Profile
                          </p>
                          <p className="text-gray-400 text-xs">Require PIN</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={editForm.isLocked}
                          onChange={(e) => setEditForm({ ...editForm, isLocked: e.target.checked })}
                          className="w-4 h-4 accent-red-600"
                        />
                      </label>

                      {editForm.isLocked && (
                        <input
                          type="password"
                          value={editForm.pin}
                          onChange={(e) => setEditForm({ ...editForm, pin: e.target.value })}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded outline-none border-2 border-gray-600 focus:border-white transition text-sm"
                          placeholder="4-digit PIN"
                          maxLength={4}
                        />
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons - Sticky Bottom */}
              <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4 flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-700 text-white px-6 py-2 rounded font-bold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfilePage;