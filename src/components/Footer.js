import { FaFacebookF, FaInstagram, FaTwitter, FaHandsHelping, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";  
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-red-900 text-white pt-20 pb-10">
      {/* Curved Top Shape */}
      <div className="absolute top-0 left-0 w-full">
        <svg viewBox="0 0 1440 320">
          <path fill="#7b0c0c" d="M0,128L48,112C96,96,192,64,288,69.3C384,75,480,117,576,154.7C672,192,768,224,864,229.3C960,235,1056,213,1152,176C1248,139,1344,85,1392,58.7L1440,32V0H0Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-16 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaHandsHelping className="text-white" />
              Spark Up
            </h2>
            <p className="text-sm mt-2">
              A platform that supports small businesses by providing tools and resources to grow.
            </p>
            <div className="flex space-x-3 mt-4">
  <span className="bg-white p-2 rounded-full hover:bg-gray-300 transition transform hover:scale-110">
    <FaFacebookF className="text-red-900 text-lg cursor-pointer" />
  </span>
  <span className="bg-white p-2 rounded-full hover:bg-gray-300 transition transform hover:scale-110">
    <FaInstagram className="text-red-900 text-lg cursor-pointer" />
  </span>
  <span className="bg-white p-2 rounded-full hover:bg-gray-300 transition transform hover:scale-110">
    <FaTwitter className="text-red-900 text-lg cursor-pointer" />
  </span>
</div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-gray-300">About Us</Link></li>
              <li><Link to="/services" className="hover:text-gray-300">Our Services</Link></li>
              <li><Link to="/projects" className="hover:text-gray-300">Projects</Link></li>
              <li><Link to="/blog" className="hover:text-gray-300">Blog</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-gray-300">FAQ</Link></li>
              <li><Link to="/testimonials" className="hover:text-gray-300">Testimonials</Link></li>
              <li><Link to="/recent-work" className="hover:text-gray-300">Recent Work</Link></li>
              <li><Link to="/features" className="hover:text-gray-300">Features</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-3">Contact Us</h3>
            <p className="text-sm flex items-center gap-2">
              <FaMapMarkerAlt className="text-white" /> 123 Main Street, Cairo, Egypt
            </p>
            <p className="text-sm flex items-center gap-2">
              <FaEnvelope className="text-white" /> info@sparkup.com
            </p>
            <p className="text-sm flex items-center gap-2">
              <FaPhone className="text-white" /> +20 123 456 7890
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm mt-8 border-t border-white/20 pt-4">
          © {new Date().getFullYear()} Spark Up. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;