import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-linear-to-r from-brand-purple via-purple-700 to-brand-purple-light text-white shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to='/' className="flex items-center gap-2 group"> 
              <span className="text-3xl group-hover:scale-110 transition-transform">🌍</span>
              <span className="text-2xl font-bold bg-linear-to-r from-pink-200 to-white bg-clip-text text-transparent group-hover:from-white group-hover:to-pink-200 transition">
                VoyaJoy
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex gap-6 items-center">
              {/* Home */}
              <Link to='/' className="hover:text-pink-200 transition font-medium relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 group-hover:w-full transition-all"></span>
              </Link>
              
              {/* Destinations */}
              <Link to="/destinations" className="hover:text-pink-200 transition font-medium relative group">
                Destinations
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 group-hover:w-full transition-all"></span>
              </Link>
              
              {/* If user logged in */}
              {user ? (
                <>
                  {/* CUSTOMER ROLE */}
                  {user.role === "CUSTOMER" && (
                    <>
                      <Link 
                        to='/customer/dashboard' 
                        className="hover:text-pink-200 transition font-medium relative group"
                      >
                        📊 Dashboard
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 group-hover:w-full transition-all"></span>
                      </Link>
                      <Link 
                        to='/customer/bookings' 
                        className="hover:text-pink-200 transition font-medium relative group"
                      >
                        🎫 My Bookings
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 group-hover:w-full transition-all"></span>
                      </Link>
                    </>
                  )}

                  {/* MANAGER ROLE */}
                  {user.role === "MANAGER" && (
                    <>
                      <Link 
                        to='/manager/dashboard' 
                        className="hover:text-pink-200 transition font-medium relative group"
                      >
                        📈 Dashboard
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 group-hover:w-full transition-all"></span>
                      </Link>
                      <Link 
                        to='/destinations' 
                        className="hover:text-pink-200 transition font-medium relative group"
                      >
                        ⚙️ Manage
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 group-hover:w-full transition-all"></span>
                      </Link>
                    </>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 px-6 py-2 rounded-full transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                /* If user not logged in */
                <>
                  <Link to="/login" className="hover:text-pink-200 transition font-medium relative group">
                    Login
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-200 group-hover:w-full transition-all"></span>
                  </Link>
                  
                  <Link 
                    to="/register"  
                    className="bg-white text-purple-700 px-6 py-2 rounded-full hover:bg-pink-50 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  > 
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Gradient Line */}
        <div className="h-1 bg-linear-to-r from-brand-pink-dark via-brand-pink to-brand-pink-light"></div>
      </nav>
    </>
  );
};

export default Navbar;