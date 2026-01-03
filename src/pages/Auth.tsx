import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(30, "Username must be less than 30 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signIn, signUp } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const surveyCompleted = localStorage.getItem("surveyCompleted") === "true";
      if (surveyCompleted) {
        navigate("/", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    try {
      if (isLogin) {
        loginSchema.parse({ email, password });
      } else {
        signupSchema.parse({ username, email, password });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
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
      } else {
        const { error } = await signUp(email, password, username);
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setEmail("");
    setPassword("");
    setUsername("");
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
            <motion.div 
              className="flex items-center justify-center gap-2 mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Leaf className="w-10 h-10 text-primary" />
              <span className="text-3xl font-bold text-foreground">Reflect</span>
              <span className="text-2xl">🌿</span>
            </motion.div>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="username"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={errors.username ? "border-destructive" : ""}
                      />
                      {errors.username && (
                        <p className="text-sm text-destructive">{errors.username}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="link"
                onClick={toggleMode}
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
