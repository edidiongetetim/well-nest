
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SignUpSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to onboarding after 3 seconds
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          
          <div className="space-y-4">
            <h1 className="font-poppins text-3xl font-bold text-primary">
              Welcome to WellNest!
            </h1>
            <p className="font-poppins text-gray-600">
              Your account has been created successfully. Let's get your profile set up so we can personalize your experience.
            </p>
          </div>

          <div className="bg-white/60 p-4 rounded-xl">
            <p className="font-poppins text-sm text-gray-500">
              Redirecting to setup in 3 seconds...
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/onboarding")}
          className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold px-8 py-3 rounded-full w-full"
        >
          Continue to Setup
        </Button>
      </div>
    </div>
  );
};

export default SignUpSuccess;
