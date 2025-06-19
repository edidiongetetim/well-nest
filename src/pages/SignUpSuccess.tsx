
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const SignUpSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center px-6 py-12 font-poppins">
      <div className="w-full max-w-md text-center">
        {/* Logo and Branding */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/91d2546c-bdfa-484f-989a-fb228fba05f8.png" 
              alt="WellNest Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2 font-poppins">WELLNEST</h1>
          <p className="text-gray-600 font-medium font-poppins">BIRTH & BEYOND</p>
        </div>

        {/* Success Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Sign up Successful!!!</h2>
          
          <p className="text-gray-600 mb-6 font-poppins">
            Welcome to WellNest! Your account has been created successfully.
          </p>

          <div className="text-gray-600 font-poppins">
            Click here to{' '}
            <Link 
              to="/login" 
              className="text-green-500 hover:text-green-600 font-medium transition-colors underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-purple-600 font-medium transition-colors font-poppins"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccess;
