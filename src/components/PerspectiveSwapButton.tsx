import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PerspectiveSwapButton = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto text-center py-8 animate-fade-in-up">
      <Button
        variant="outline"
        size="lg"
        onClick={() => navigate("/perspective-swap")}
        className="group border-2 border-primary/30 hover:border-primary hover:bg-sage-light/50"
      >
        <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
        Get a new perspective on something that happened today
      </Button>
    </div>
  );
};

export default PerspectiveSwapButton;
