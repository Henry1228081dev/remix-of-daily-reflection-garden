import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListTodo, Plus, X } from "lucide-react";
import { useTinySteps } from "@/hooks/useTinySteps";
import { useCookies } from "@/hooks/useCookies";

interface TinyStepsCardProps {
  onCookieEarned?: (count: number) => void;
}

const TinyStepsCard = ({ onCookieEarned }: TinyStepsCardProps) => {
  const { steps, isLoading, addStep, toggleStep, deleteStep, completedCount } = useTinySteps();
  const { addCookie, totalCount } = useCookies();
  const [newStep, setNewStep] = useState("");

  const handleToggleStep = async (id: string, currentCompleted: boolean, stepText: string) => {
    const newCompleted = !currentCompleted;
    
    // Award cookie when completing (not uncompleting)
    if (newCompleted) {
      addCookie.mutate({ 
        description: `Completed: ${stepText}`, 
        source: "step" 
      });
      onCookieEarned?.(totalCount + 1);
    }
    
    toggleStep.mutate({ id, completed: newCompleted });
  };

  const handleAddStep = () => {
    if (newStep.trim()) {
      addStep.mutate(newStep.trim());
      setNewStep("");
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-3">
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading steps...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-primary" />
          Today's tiny steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            Add your first tiny step for today 🌱
          </p>
        ) : (
          steps.map((step) => (
            <div 
              key={step.id} 
              className="flex items-center gap-3 group"
            >
              <Checkbox 
                id={step.id}
                checked={step.completed}
                onCheckedChange={() => handleToggleStep(step.id, step.completed, step.text)}
                className="border-primary data-[state=checked]:bg-primary"
              />
              <label 
                htmlFor={step.id}
                className={`flex-1 text-sm cursor-pointer transition-all ${
                  step.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}
              >
                {step.text}
              </label>
              <button 
                onClick={() => deleteStep.mutate(step.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}

        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Add a tiny step..."
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
            className="bg-secondary/50 border-sage-light/30 text-sm"
          />
          <Button 
            variant="gentle" 
            size="icon"
            onClick={handleAddStep}
            disabled={!newStep.trim() || addStep.isPending}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          {completedCount}/{steps.length} completed • Every tiny step counts. 🌱
        </p>
      </CardContent>
    </Card>
  );
};

export default TinyStepsCard;
