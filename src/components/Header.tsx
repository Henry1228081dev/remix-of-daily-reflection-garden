import { Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import LofiPlayer from "@/components/demo/LofiPlayer";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      localStorage.removeItem("surveyCompleted");
      navigate("/", { replace: true });
      toast({
        title: "See you soon! 🌿",
        description: "Take care of yourself.",
      });
    }
  };

  return (
    <header className="w-full py-6 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-8 h-8 text-primary animate-gentle-bounce" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Reflect
          </h1>
          <span className="text-2xl">🌿</span>
        </div>
        <p className="text-muted-foreground text-lg">
          A gentle daily check-in for your mind.
        </p>
        
        {user && (
          <div className="absolute right-0 top-0 flex items-center gap-3">
            <LofiPlayer />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
