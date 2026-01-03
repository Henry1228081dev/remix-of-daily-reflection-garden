import { cn } from "@/lib/utils";

interface TexturedBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const TexturedBackground = ({ className, children }: TexturedBackgroundProps) => {
  return (
    <div className={cn("relative min-h-screen w-full", className)}>
      {/* Base warm cream background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Smooth gradient overlay instead of pixelated noise */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, hsl(var(--accent) / 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(var(--secondary) / 0.1) 0%, transparent 70%)
          `,
        }}
      />
      
      {/* Very subtle grain - higher frequency, lower opacity for less pixelation */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
