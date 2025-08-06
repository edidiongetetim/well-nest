
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-purple-800 hover:text-purple-600"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-6 mt-6">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/lovable-uploads/91d2546c-bdfa-484f-989a-fb228fba05f8.png" 
              alt="WellNest Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-xl font-bold text-purple-800">WellNest</span>
          </div>
          
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-lg font-medium text-purple-800 hover:text-purple-600 transition-colors py-2"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-lg font-medium text-gray-600 hover:text-purple-600 transition-colors py-2"
              onClick={handleLinkClick}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-lg font-medium text-gray-600 hover:text-purple-600 transition-colors py-2"
              onClick={handleLinkClick}
            >
              About
            </Link>
            
            <div className="pt-6 border-t border-gray-200">
              <Link to="/dashboard" onClick={handleLinkClick}>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
