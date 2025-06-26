
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthHandler } from '@/components/AuthHandler';

const AuthCallback = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-green-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return <AuthHandler />;
};

export default AuthCallback;
