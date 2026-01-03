"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"

interface ChartData {
  label: string
  value: number
}

interface MiniChartProps {
  data?: ChartData[]
  title?: string
}

const defaultData = [
  { label: "Mon", value: 65 },
  { label: "Tue", value: 85 },
  { label: "Wed", value: 45 },
  { label: "Thu", value: 95 },
  { label: "Fri", value: 70 },
  { label: "Sat", value: 55 },
  { label: "Sun", value: 80 },
]

export function MiniChart({ data = defaultData, title = "Activity" }: MiniChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [displayValue, setDisplayValue] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const maxValue = Math.max(...data.map((d) => d.value))

  useEffect(() => {
    if (hoveredIndex !== null) {
      setDisplayValue(data[hoveredIndex].value)
    }
  }, [hoveredIndex, data])

  const handleContainerEnter = () => setIsHovering(true)
  const handleContainerLeave = () => {
    setIsHovering(false)
    setHoveredIndex(null)
    setTimeout(() => {
      setDisplayValue(null)
    }, 150)
  }

  return (
    <div className="relative w-full max-w-xs rounded-2xl border border-border/50 bg-card p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Activity className="h-4 w-4" />
          {title}
        </div>
        <div className="text-right">
          <span className={cn(
            "text-2xl font-bold text-foreground transition-opacity duration-150",
            displayValue === null && "opacity-50"
          )}>
            {displayValue !== null ? displayValue : "—"}
            <span className="text-sm font-normal text-muted-foreground ml-0.5">
              %
            </span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div
        ref={containerRef}
        className="relative flex items-end justify-between gap-1 h-28"
        onMouseEnter={handleContainerEnter}
        onMouseLeave={handleContainerLeave}
      >
        {data.map((item, index) => {
          const heightPx = (item.value / maxValue) * 96
          const isHovered = hoveredIndex === index
          const isAnyHovered = hoveredIndex !== null
          const isNeighbor = hoveredIndex !== null && (index === hoveredIndex - 1 || index === hoveredIndex + 1)

          return (
            <div
              key={item.label}
              className="relative flex flex-col items-center flex-1 group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-lg transition-all duration-300 ease-out",
                  isHovered 
                    ? "bg-primary shadow-lg shadow-primary/25" 
                    : isNeighbor 
                      ? "bg-primary/40" 
                      : isAnyHovered 
                        ? "bg-muted/60" 
                        : "bg-primary/60"
                )}
                style={{ 
                  height: `${heightPx}px`,
                  transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                  transformOrigin: 'bottom'
                }}
              />

              {/* Label */}
              <span className={cn(
                "mt-2 text-xs transition-colors duration-200",
                isHovered ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {item.label.charAt(0)}
              </span>

              {/* Tooltip */}
              <div className={cn(
                "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium",
                "transition-all duration-200 pointer-events-none",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}>
                {item.value}%
              </div>
            </div>
          )
        })}
      </div>

      {/* Subtle glow effect on hover */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-primary/5 transition-opacity duration-300 pointer-events-none",
        isHovering ? "opacity-100" : "opacity-0"
      )} />
    </div>
  )
}
