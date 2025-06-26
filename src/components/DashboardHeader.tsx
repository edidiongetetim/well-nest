
import { useState } from "react";
import { Search, Menu, X, Home, Heart, Brain, Users, Bot, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { SearchResults } from "./SearchResults";
import { Link, useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setShowResults(false);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const mobileNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Heart, label: "Health", path: "/health" },
    { icon: Brain, label: "Mental", path: "/mental" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Bot, label: "AI Chatbot", path: "/ai-chatbot" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Hamburger Menu - Only visible on mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuToggle}
              className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop Search - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md relative">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search posts, reminders, health logs..."
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="pl-10 bg-gray-100 border-0 rounded-full font-poppins"
              />
            </form>
            
            {showResults && (
              <SearchResults 
                query={searchQuery} 
                onClose={() => setShowResults(false)}
              />
            )}
          </div>
          
          {/* Desktop Actions - Always visible */}
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-xl animate-slide-down md:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/91d2546c-bdfa-484f-989a-fb228fba05f8.png" 
                  alt="WellNest Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-purple-800 font-poppins">WellNest</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation Items */}
            <div className="p-6 space-y-3">
              {mobileNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleMobileNavClick(item.path)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all duration-200 text-left"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-800 font-poppins">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Search Bar - Sticky */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search WellNest..."
                  className="pl-10 bg-gray-100 border-0 rounded-full font-poppins focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
