"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CheckIcon, ArrowRightIcon } from "lucide-react"

type Step = {
  id: number
  label: string
  field: string
  placeholder: string
  type?: string
}

interface MultiStepFormProps {
  steps: Step[]
  onComplete: (data: Record<string, string>) => void
  submitLabel?: string
  isSubmitting?: boolean
}

export function MultiStepForm({ steps, onComplete, submitLabel = "Complete", isSubmitting = false }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formData[currentStepData.field]) {
      e.preventDefault()
      handleNext()
    }
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckIcon className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">You're all set</p>
              <p className="text-muted-foreground">{formData.name || formData.email}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => index < currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
              className={cn(
                "group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-700 ease-out",
                "disabled:cursor-not-allowed",
                index < currentStep && "bg-foreground/10 text-foreground/60",
                index === currentStep && "bg-foreground text-background shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)]",
                index > currentStep && "bg-muted/50 text-muted-foreground/40",
              )}
            >
              {index < currentStep ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
              {index === currentStep && (
                <span className="absolute inset-0 rounded-full animate-ping bg-foreground/20" />
              )}
            </button>
            {index < steps.length - 1 && (
              <div className="relative mx-2 h-[2px] w-8 overflow-hidden rounded-full bg-muted/50">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 bg-foreground/60 transition-all duration-700",
                    index < currentStep ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted/30 mb-8">
        <div
          className="h-full bg-foreground/80 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={currentStepData.field} className="text-base font-medium">
              {currentStepData.label}
            </Label>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1}/{steps.length}
            </span>
          </div>
          <div className="relative">
            <Input
              id={currentStepData.field}
              type={currentStepData.type || "text"}
              placeholder={currentStepData.placeholder}
              value={formData[currentStepData.field] || ""}
              onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-14 text-base transition-all duration-500 border-border/50 focus:border-foreground/20 bg-background/50 backdrop-blur"
            />
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={!formData[currentStepData.field] || isSubmitting}
          className="w-full h-12 text-base group"
        >
          <span className="flex items-center gap-2">
            {currentStep === steps.length - 1 ? submitLabel : "Continue"}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>

        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full text-center text-sm text-muted-foreground/60 hover:text-foreground/80 transition-all duration-300"
          >
            Go back
          </button>
        )}
      </div>
    </div>
  )
}
