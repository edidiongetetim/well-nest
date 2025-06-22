
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import MobileNav from "./MobileNav";

const Header = () => {
  const location = useLocation();

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full px-6 py-4">
      <nav className="max-w-7xl mx-auto bg-background/80 backdrop-blur-sm rounded-2xl border border-border px-8 py-4 shadow-sm transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/91d2546c-bdfa-484f-989a-fb228fba05f8.png" 
              alt="WellNest Logo" 
              className="w-16 h-16 object-contain object-left"
              style={{ objectPosition: 'left center' }}
            />
            <span className="text-2xl font-bold text-purple-800 transition-colors duration-300 ease-in-out">WellNest</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`nav-link font-medium ${
                isActivePage('/') 
                  ? 'text-purple-600 font-bold' 
                  : 'text-foreground hover:text-purple-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`nav-link font-medium ${
                isActivePage('/services') 
                  ? 'text-purple-600 font-bold' 
                  : 'text-foreground hover:text-purple-600'
              }`}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`nav-link font-medium ${
                isActivePage('/about') 
                  ? 'text-purple-600 font-bold' 
                  : 'text-foreground hover:text-purple-600'
              }`}
            >
              About
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-purple-200 text-purple-800 hover:bg-purple-50 transition-all duration-300 ease-in-out">
                Login/SignUp
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </nav>
    </header>
  );
};

export default Header;
