import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

function Footer() {
  const handleSocialClick = (platform) => {
    alert(`Opening Netflixy ${platform}...`);
  };

  const handleServiceCode = () => {
    alert('Service Code: NFLX-2026-CLONE\n\nThis would show your service code for customer support.');
  };

  return (
    <footer className="bg-black text-gray-400 py-12 md:py-16 px-4 md:px-12 lg:px-32 mt-20">
      {/* Social Icons */}
      <div className="flex gap-6 mb-8">
        <FaFacebookF 
          className="text-2xl cursor-pointer hover:text-white transition duration-200"
          onClick={() => handleSocialClick('Facebook')}
        />
        <FaInstagram 
          className="text-2xl cursor-pointer hover:text-white transition duration-200"
          onClick={() => handleSocialClick('Instagram')}
        />
        <FaTwitter 
          className="text-2xl cursor-pointer hover:text-white transition duration-200"
          onClick={() => handleSocialClick('Twitter')}
        />
        <FaYoutube 
          className="text-2xl cursor-pointer hover:text-white transition duration-200"
          onClick={() => handleSocialClick('YouTube')}
        />
      </div>

      {/* Footer Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-xs md:text-sm">
        <div className="space-y-3">
          <p className="cursor-pointer hover:underline">Audio Description</p>
          <p className="cursor-pointer hover:underline">Investor Relations</p>
          <p className="cursor-pointer hover:underline">Legal Notices</p>
        </div>
        <div className="space-y-3">
          <p className="cursor-pointer hover:underline">Help Center</p>
          <p className="cursor-pointer hover:underline">Jobs</p>
          <p className="cursor-pointer hover:underline">Cookie Preferences</p>
        </div>
        <div className="space-y-3">
          <p className="cursor-pointer hover:underline">Gift Cards</p>
          <p className="cursor-pointer hover:underline">Terms of Use</p>
          <p className="cursor-pointer hover:underline">Corporate Information</p>
        </div>
        <div className="space-y-3">
          <p className="cursor-pointer hover:underline">Media Center</p>
          <p className="cursor-pointer hover:underline">Privacy</p>
          <p className="cursor-pointer hover:underline">Contact Us</p>
        </div>
      </div>

      {/* Service Code Button */}
      <button 
        className="border border-gray-500 px-5 py-2 text-xs md:text-sm mb-8 hover:text-white hover:border-white transition duration-200"
        onClick={handleServiceCode}
      >
        Service Code
      </button>

      {/* Copyright */}
      <p className="text-xs text-gray-500">© 2026 Netflixy, Inc. | Clone Project for Educational Purposes</p>
    </footer>
  );
}


export default Footer;

