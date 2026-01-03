import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Footprints, Plus, Trash2 } from "lucide-react";

interface DemoTinyStepsCardProps {
  onCookieEarned: (description: string) => void;
}

const DemoTinyStepsCard = ({ onCookieEarned }: DemoTinyStepsCardProps) => {
  const [steps, setSteps] = useState([
    { id: "1", text: "Drink a glass of water", completed: true },
    { id: "2", text: "Take 3 deep breaths", completed: false },
    { id: "3", text: "Stretch for 2 minutes", completed: false },
  ]);
  const [newStep, setNewStep] = useState("");

  const addStep = () => {
    if (newStep.trim()) {
      setSteps(prev => [...prev, { id: Date.now().toString(), text: newStep.trim(), completed: false }]);
      setNewStep("");
    }
  };

  const toggleStep = (id: string) => {
    setSteps(prev => prev.map(step => {
      if (step.id === id && !step.completed) {
        onCookieEarned(`Completed: ${step.text}`);
        return { ...step, completed: true };
      }
      return step.id === id ? { ...step, completed: !step.completed } : step;
    }));
  };

  const deleteStep = (id: string) => {
    setSteps(prev => prev.filter(step => step.id !== id));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Footprints className="w-5 h-5 text-primary" />
          Tiny Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Add a tiny step..."
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStep()}
            className="flex-1"
          />
          <Button size="icon" onClick={addStep} disabled={!newStep.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {steps.map(step => (
            <div key={step.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 group">
              <Checkbox 
                checked={step.completed} 
                onCheckedChange={() => toggleStep(step.id)}
              />
              <span className={`flex-1 text-sm ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                {step.text}
              </span>
              <button 
                onClick={() => deleteStep(step.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          Complete steps to earn cookies! 🍪
        </p>
      </CardContent>
    </Card>
  );
};

export default DemoTinyStepsCard;
