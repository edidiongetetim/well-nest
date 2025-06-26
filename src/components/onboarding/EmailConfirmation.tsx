
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailConfirmationProps {
  onNext: () => void;
  email?: string;
}

export const EmailConfirmation = ({ onNext, email }: EmailConfirmationProps) => {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email sent!",
          description: "Verification email sent successfully. Check your inbox.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Mail className="w-24 h-24 text-purple-500" />
            <CheckCircle className="w-8 h-8 text-green-500 absolute -bottom-2 -right-2" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="font-poppins text-4xl font-bold text-primary">
            Check Your Email 📬
          </h1>
          <p className="font-poppins text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            We've sent a confirmation link to your inbox. Please verify your email to continue using WellNest.
          </p>
          {email && (
            <p className="font-poppins text-sm text-gray-500">
              We sent a confirmation link to <strong>{email}</strong>
            </p>
          )}
        </div>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-poppins font-semibold text-lg text-primary">
              What's next?
            </h3>
            <ul className="font-poppins text-gray-600 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Check your email inbox</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Click the confirmation link</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Return here to complete setup</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="font-poppins text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or tap below to resend.
          </p>
          
          <Button
            onClick={handleResendEmail}
            disabled={isResending || !email}
            variant="outline"
            className="font-poppins"
          >
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Button>
        </div>

        <p className="font-poppins text-sm text-gray-500">
          Once verified, come back and log in again to complete setup.
        </p>
      </div>

      <div className="text-center pt-8">
        <Button
          onClick={onNext}
          className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Got it
        </Button>
      </div>
    </div>
  );
};
