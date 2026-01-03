import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MultiStepForm } from "@/components/ui/multistep-form";
import { motion } from "framer-motion";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(30, "Name must be less than 30 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSteps = [
  { id: 1, label: "Email", field: "email", placeholder: "you@example.com", type: "email" },
  { id: 2, label: "Password", field: "password", placeholder: "••••••••", type: "password" },
];

const signupSteps = [
  { id: 1, label: "Your Name", field: "name", placeholder: "What should we call you?" },
  { id: 2, label: "Email", field: "email", placeholder: "you@example.com", type: "email" },
  { id: 3, label: "Password", field: "password", placeholder: "Create a secure password", type: "password" },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signIn, signUp } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const surveyCompleted = localStorage.getItem("surveyCompleted") === "true";
      if (surveyCompleted) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleLogin = async (data: Record<string, string>) => {
    try {
      loginSchema.parse(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: err.errors[0]?.message || "Please check your input",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back! 🌿",
          description: "Great to see you again.",
        });
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: Record<string, string>) => {
    try {
      signupSchema.parse(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: err.errors[0]?.message || "Please check your input",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp(data.email, data.password, data.name);
      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Try logging in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome to Reflect! 🌱",
          description: "Your account has been created. Let's personalize your experience.",
        });
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-xl">
          <CardHeader className="text-center pb-2">
            <Link to="/">
              <motion.div 
                className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Leaf className="w-10 h-10 text-primary" />
                <span className="text-3xl font-bold text-foreground">Reflect</span>
                <span className="text-2xl">🌿</span>
              </motion.div>
            </Link>
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome back" : "Start your journey"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin 
                ? "Sign in to continue your reflection practice" 
                : "Create an account to begin your mindful journey"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            {isLogin ? (
              <MultiStepForm
                key="login"
                steps={loginSteps}
                onComplete={handleLogin}
                submitLabel="Sign In"
                isSubmitting={isSubmitting}
              />
            ) : (
              <MultiStepForm
                key="signup"
                steps={signupSteps}
                onComplete={handleSignup}
                submitLabel="Create Account"
                isSubmitting={isSubmitting}
              />
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80"
              >
                {isLogin ? "Create one here" : "Sign in instead"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          A gentle space for your daily reflections 🌱
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
