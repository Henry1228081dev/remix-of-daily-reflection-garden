import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, BellOff, Moon, Sun } from "lucide-react";
import { useMoodNotifications } from "@/hooks/useMoodNotifications";
import { useMoodEntries } from "@/hooks/useMoodEntries";

const MoodNotificationSettings = () => {
  const { upsertMood } = useMoodEntries();
  
  const handleMoodSelect = (mood: string) => {
    upsertMood.mutate(mood);
  };

  const {
    isEnabled,
    hasPermission,
    sleepStart,
    sleepEnd,
    enableNotifications,
    disableNotifications,
    updateSleepHours,
  } = useMoodNotifications(handleMoodSelect);

  const [localSleepStart, setLocalSleepStart] = useState(sleepStart);
  const [localSleepEnd, setLocalSleepEnd] = useState(sleepEnd);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number): string => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const handleToggle = async (enabled: boolean) => {
    if (enabled) {
      await enableNotifications();
    } else {
      disableNotifications();
    }
  };

  const handleSleepHoursChange = () => {
    updateSleepHours(localSleepStart, localSleepEnd);
  };

  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          {isEnabled ? (
            <Bell className="w-5 h-5 text-primary" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground" />
          )}
          Mood Check-in Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="mood-notifications" className="text-sm font-medium">
              Enable notifications
            </Label>
            <p className="text-xs text-muted-foreground">
              Get 4 gentle reminders throughout the day
            </p>
          </div>
          <Switch
            id="mood-notifications"
            checked={isEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {isEnabled && (
          <div className="space-y-4 pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Set your sleep hours so we don't disturb you:
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs">
                  <Moon className="w-3 h-3" />
                  Sleep starts at
                </Label>
                <Select
                  value={localSleepStart.toString()}
                  onValueChange={(v) => setLocalSleepStart(parseInt(v))}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {formatHour(hour)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs">
                  <Sun className="w-3 h-3" />
                  Wake up at
                </Label>
                <Select
                  value={localSleepEnd.toString()}
                  onValueChange={(v) => setLocalSleepEnd(parseInt(v))}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {formatHour(hour)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(localSleepStart !== sleepStart || localSleepEnd !== sleepEnd) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSleepHoursChange}
                className="w-full"
              >
                Update sleep schedule
              </Button>
            )}

            <p className="text-xs text-muted-foreground italic text-center">
              You'll receive check-ins between {formatHour(localSleepEnd)} and {formatHour(localSleepStart)} 💚
            </p>
          </div>
        )}

        {!hasPermission && !isEnabled && (
          <p className="text-xs text-muted-foreground italic">
            We'll ask for notification permission when you enable this.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodNotificationSettings;
