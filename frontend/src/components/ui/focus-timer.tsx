import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusTimerProps {
  className?: string;
}

export function FocusTimer({ className }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState<"focus" | "break">("focus");

  const focusTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Auto switch between focus and break
      if (timerType === "focus") {
        setTimerType("break");
        setTimeLeft(breakTime);
      } else {
        setTimerType("focus");
        setTimeLeft(focusTime);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerType, focusTime, breakTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timerType === "focus" 
    ? ((focusTime - timeLeft) / focusTime) * 100
    : ((breakTime - timeLeft) / breakTime) * 100;

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(timerType === "focus" ? focusTime : breakTime);
  };

  const switchTimerType = (type: "focus" | "break") => {
    setIsRunning(false);
    setTimerType(type);
    setTimeLeft(type === "focus" ? focusTime : breakTime);
  };

  return (
    <Card className={cn("glass-card p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Focus Timer</h3>
      </div>

      {/* Timer Type Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={timerType === "focus" ? "default" : "outline"}
          size="sm"
          onClick={() => switchTimerType("focus")}
          className={timerType === "focus" ? "bg-ocean" : ""}
        >
          Focus (25m)
        </Button>
        <Button
          variant={timerType === "break" ? "default" : "outline"}
          size="sm"
          onClick={() => switchTimerType("break")}
          className={timerType === "break" ? "bg-success" : ""}
        >
          Break (5m)
        </Button>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          {/* Progress Ring */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-muted/20"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeLinecap="round"
              className={timerType === "focus" ? "text-primary" : "text-success"}
              style={{
                strokeDasharray: `${2 * Math.PI * 54}`,
                strokeDashoffset: `${2 * Math.PI * 54 * (1 - progress / 100)}`,
                transition: 'stroke-dashoffset 1s ease'
              }}
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {timerType}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="rounded-full"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={handlePlayPause}
          className={cn(
            "rounded-full px-8",
            isRunning 
              ? "bg-destructive hover:bg-destructive/90" 
              : timerType === "focus" 
                ? "bg-ocean hover:bg-primary-dark" 
                : "bg-success hover:bg-success/90"
          )}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}