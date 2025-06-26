
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="underline decoration-purple-400 decoration-4">Your AI-Powered companion</span>
              <br />
              <span className="text-purple-800">for pregnancy & postpartum</span>
              <br />
              <span className="underline decoration-purple-400 decoration-4">mind and body wellness.</span>
            </h1>
            
            <p className="text-xl text-gray-600 font-medium max-w-lg">
              Track how you feel and listen to your body.
            </p>
          </div>
          
          <Link to="/signup">
            <button 
              className="w-72 h-24 text-white text-lg font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
              style={{
                background: 'linear-gradient(to right, #A68AE6, #C3E8DE)',
                borderRadius: '999px'
              }}
            >
              Get Started
            </button>
          </Link>
        </div>

        {/* Right Content - Logo */}
        <div className="relative">
          <div className="relative z-10 flex justify-center items-center">
            <img 
              src="/lovable-uploads/91d2546c-bdfa-484f-989a-fb228fba05f8.png" 
              alt="WellNest - Birth & Beyond" 
              className="w-[500px] h-[500px] object-contain"
            />
          </div>
          
          {/* Background decorative shapes */}
          <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
          </div>
          <div className="absolute -z-10 top-1/4 right-0">
            <div className="w-64 h-64 bg-green-100 rounded-full opacity-30 blur-2xl"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
