
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full px-6 py-4">
      <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/91d2546c-bdfa-484f-989a-fb228fba05f8.png" 
              alt="WellNest Logo" 
              className="w-16 h-16 object-contain object-left"
              style={{ objectPosition: 'left center' }}
            />
            <span className="text-2xl font-bold text-purple-800">WellNest</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-purple-800 font-medium hover:text-purple-600 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-600 font-medium hover:text-purple-600 transition-colors">
              Services
            </a>
            <a href="#" className="text-gray-600 font-medium hover:text-purple-600 transition-colors">
              About
            </a>
            <Link to="/login">
              <Button variant="outline" className="border-purple-200 text-purple-800 hover:bg-purple-50">
                Login/SignUp
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
