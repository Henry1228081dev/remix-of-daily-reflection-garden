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
          color1: '#4ade80',
          color2: '#16a34a',
          color3: '#166534',
          speed: 0.4,
          scale: 1.5,
          type: 'silk',
          noise: 0.1,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
