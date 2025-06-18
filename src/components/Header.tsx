
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full px-6 py-4">
      <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold text-purple-800">WellNest</span>
          </div>
          
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
            <Button variant="outline" className="border-purple-200 text-purple-800 hover:bg-purple-50">
              Login/SignUp
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
