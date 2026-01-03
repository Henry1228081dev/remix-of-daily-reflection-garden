"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AppUsage {
  icon: React.ReactNode;
  name: string;
  duration: string;
  color?: string;
}

interface ScreenTimeCardProps {
  totalHours: number;
  totalMinutes: number;
  barData: number[];
  timeLabels?: string[];
  topApps: AppUsage[];
  className?: string;
}

export const ScreenTimeCard = ({
  totalHours,
  totalMinutes,
  barData,
  timeLabels = ["5 AM", "11 AM", "5 PM"],
  topApps,
  className,
}: ScreenTimeCardProps) => {
  const maxValue = Math.max(...barData);
  const normalizedData = barData.map((value) => value / maxValue);

  const barVariants = {
    hidden: { scaleY: 0 },
    visible: (i: number) => ({
      scaleY: 1,
      transition: {
        delay: i * 0.02,
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl rounded-3xl bg-card/80 backdrop-blur-xl p-6 shadow-xl border border-border/50",
        className
      )}
    >
      <div className="flex gap-6">
        {/* Left side - Main graph */}
        <div className="flex-1">
          {/* Total time display */}
          <div className="mb-4">
            <span className="text-4xl font-bold text-foreground">
              {totalHours}h {totalMinutes}m
            </span>
          </div>

          {/* Bar graph */}
          <div className="relative h-32">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground pr-2">
              <span>2h</span>
              <span>1h</span>
              <span>0</span>
            </div>

            {/* Horizontal guide lines */}
            <div className="absolute left-8 right-0 top-0 h-full flex flex-col justify-between pointer-events-none">
              <div className="w-full h-px bg-border/50" />
              <div className="w-full h-px bg-border/50" />
              <div className="w-full h-px bg-border/50" />
            </div>

            {/* Bars */}
            <div className="absolute left-8 right-0 bottom-4 top-0 flex items-end gap-[2px]">
              {normalizedData.map((height, index) => {
                const isHighlighted = height > 0.6;
                const barColor = isHighlighted
                  ? "bg-gradient-to-t from-primary to-primary/80"
                  : "bg-muted dark:bg-muted/50";

                return (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={barVariants}
                    style={{
                      height: `${height * 100}%`,
                      originY: 1,
                    }}
                    className={cn(
                      "flex-1 rounded-t-sm transition-colors",
                      barColor
                    )}
                  />
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute left-8 right-0 bottom-0 flex justify-between text-xs text-muted-foreground">
              {timeLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-border/50 self-stretch" />

        {/* Right side - Top apps */}
        <div className="flex flex-col gap-3 min-w-[100px]">
          {topApps.map((app, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  app.color || "bg-primary/10 text-primary"
                )}
              >
                {app.icon}
              </div>
              <span className="text-sm font-medium text-foreground">
                {app.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
