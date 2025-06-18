
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

        {/* Right Content - Logo */}
        <div className="relative">
          <div className="relative z-10 flex justify-center items-center">
            <img 
              src="/lovable-uploads/91d2546c-bdfa-484f-989a-fb228fba05f8.png" 
              alt="WellNest - Birth & Beyond" 
              className="w-96 h-96 object-contain"
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
