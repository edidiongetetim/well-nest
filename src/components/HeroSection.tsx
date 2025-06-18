
import { Button } from "@/components/ui/button";

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
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Button>
        </div>

        {/* Right Content - Illustration */}
        <div className="relative">
          <div className="relative z-10">
            {/* Purple circular background with baby illustration */}
            <div className="w-80 h-80 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full"></div>
              
              {/* Baby illustration placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-purple-200 rounded-full flex items-center justify-center">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="text-purple-600">
                    <circle cx="60" cy="45" r="25" fill="currentColor" opacity="0.3"/>
                    <ellipse cx="60" cy="75" rx="35" ry="30" fill="currentColor" opacity="0.3"/>
                    <circle cx="52" cy="40" r="2" fill="currentColor"/>
                    <circle cx="68" cy="40" r="2" fill="currentColor"/>
                    <path d="M55 48 Q60 52 65 48" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
              </div>
              
              {/* Sparkles */}
              <div className="absolute -top-4 -right-4 w-6 h-6 text-purple-400">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0l3.09 6.91L22 9l-6.91 2.09L12 18l-3.09-6.91L2 9l6.91-2.09L12 0z"/>
                </svg>
              </div>
              <div className="absolute top-8 -left-6 w-4 h-4 text-purple-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0l3.09 6.91L22 9l-6.91 2.09L12 18l-3.09-6.91L2 9l6.91-2.09L12 0z"/>
                </svg>
              </div>
              <div className="absolute -bottom-2 right-8 w-5 h-5 text-purple-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0l3.09 6.91L22 9l-6.91 2.09L12 18l-3.09-6.91L2 9l6.91-2.09L12 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* WELLNEST branding */}
          <div className="absolute bottom-0 right-0 text-right">
            <div className="text-6xl font-bold text-purple-800 leading-none">
              WELLNEST
            </div>
            <div className="text-lg text-gray-600 font-medium tracking-wider">
              BIRTH & BEYOND
            </div>
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
