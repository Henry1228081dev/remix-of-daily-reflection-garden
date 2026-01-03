import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface HeroSectionProps {
  onStartCheckIn: () => void;
}

const HeroSection = ({ onStartCheckIn }: HeroSectionProps) => {
  return (
    <section className="w-full py-8 px-4 animate-fade-in-up stagger-1">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
          Reflect, gain perspective, and celebrate tiny wins, one day at a time.
        </p>
        <Button 
          variant="wellness" 
          size="xl" 
          onClick={onStartCheckIn}
          className="group"
        >
          <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Start Check-In
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
