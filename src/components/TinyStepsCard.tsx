import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListTodo, Plus, X } from "lucide-react";

interface Step {
  id: string;
  text: string;
  completed: boolean;
}

const TinyStepsCard = () => {
  const [steps, setSteps] = useState<Step[]>([
    { id: "1", text: "Checked in on my mood", completed: false },
    { id: "2", text: "Wrote one sentence in my journal", completed: false },
  ]);
  const [newStep, setNewStep] = useState("");

  const toggleStep = (id: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, { 
        id: Date.now().toString(), 
        text: newStep.trim(), 
        completed: false 
      }]);
      setNewStep("");
    }
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const completedCount = steps.filter(s => s.completed).length;

  return (
    <Card className="bg-card shadow-card border-0 animate-fade-in-up stagger-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-primary" />
          Today's tiny steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className="flex items-center gap-3 group"
          >
            <Checkbox 
              id={step.id}
              checked={step.completed}
              onCheckedChange={() => toggleStep(step.id)}
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
              onClick={() => removeStep(step.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Add a tiny step..."
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addStep()}
            className="bg-secondary/50 border-sage-light/30 text-sm"
          />
          <Button 
            variant="gentle" 
            size="icon"
            onClick={addStep}
            disabled={!newStep.trim()}
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
