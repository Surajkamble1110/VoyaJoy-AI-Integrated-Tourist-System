import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-r from-brand-purple via-purple-700 to-brand-purple-light text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌍</span>
              <h3 className="text-2xl font-bold bg-linear-to-r from-pink-200 to-white bg-clip-text text-transparent">
                VoyaJoy
              </h3>
            </div>
            <p className="text-pink-100 text-sm leading-relaxed">
              Your trusted travel companion for unforgettable journeys across India. 
              Explore, book, and create memories that last forever.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <span className="text-xl">📸</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <span className="text-xl">🐦</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-200">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-pink-100 hover:text-white transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-pink-100 hover:text-white transition text-sm">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-pink-100 hover:text-white transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-pink-100 hover:text-white transition text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-200">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-pink-100 hover:text-white transition text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-pink-100 hover:text-white transition text-sm">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-pink-100 hover:text-white transition text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-pink-100 hover:text-white transition text-sm">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-200">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-pink-100 text-sm">
                <span className="mt-1">📞</span>
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p>+91-1800-XXX-XXXX</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-pink-100 text-sm">
                <span className="mt-1">📧</span>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p>support@voyajoy.com</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-pink-100 text-sm">
                <span className="mt-1">📍</span>
                <div>
                  <p className="font-semibold text-white">Address</p>
                  <p>Mumbai, Maharashtra, India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-pink-100 text-sm">
              © {currentYear} VoyaJoy. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-pink-100 hover:text-white transition text-sm">
                Terms
              </a>
              <a href="#" className="text-pink-100 hover:text-white transition text-sm">
                Privacy
              </a>
              <a href="#" className="text-pink-100 hover:text-white transition text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="h-2 bg-linear-to-r from-brand-pink-dark via-brand-pink to-brand-pink-light"></div>
    </footer>
  );
};

export default Footer;