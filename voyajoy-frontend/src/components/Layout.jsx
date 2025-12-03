import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />          
      {/* Main Content with Gradient Background */}
      <main className="grow bg-linear-to-b from-pink-700 via-pink-200 to-pink-700">
        {/* Gradient Overlay for smooth transition */}
        <div className="relative">
          {/* Top Dark Pink Fade */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-pink-700 to-transparent pointer-events-none"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Bottom Dark Pink Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-pink-700 to-transparent pointer-events-none"></div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;