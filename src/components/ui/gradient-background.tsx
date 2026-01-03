import { cn } from "@/lib/utils";
import { GradFlow } from 'gradflow';

interface GradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const GradientBackground = ({ className, children }: GradientBackgroundProps) => {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      <GradFlow
        className="absolute inset-0 z-0"
        config={{
          // Warm cream and sage green palette matching the app
          color1: '#f5f0e8', // Warm cream
          color2: '#8fbc8f', // Sage green (primary)
          color3: '#d4c5a9', // Warm beige accent
          speed: 0.3,
          scale: 1.8,
          type: 'silk',
          noise: 0.08,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
