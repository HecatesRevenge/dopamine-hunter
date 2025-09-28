import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarWidgetProps {
  className?: string;
}

interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
}

export function CalendarWidget({ className }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Morning workout",
      date: new Date(),
      completed: false,
    },
    {
      id: "2", 
      title: "Review project",
      date: new Date(Date.now() + 86400000), // Tomorrow
      completed: false,
    },
  ]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const hasTask = (day: number) => {
    return tasks.some(task => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getTasksForDate = (day: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDate(day);
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          className={cn(
            "h-10 w-full rounded-lg text-sm font-medium transition-all duration-200 relative",
            "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
            isToday(day) && "bg-ocean text-white font-bold shadow-glow",
            isSelected(day) && !isToday(day) && "bg-primary/10 text-primary font-semibold",
            hasTask(day) && !isToday(day) && "bg-accent/10 text-accent-foreground"
          )}
        >
          {day}
          {hasTask(day) && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
              {dayTasks.slice(0, 3).map((_, index) => (
                <div 
                  key={index}
                  className={cn(
                    "w-1 h-1 rounded-full",
                    isToday(day) ? "bg-white" : "bg-primary"
                  )}
                />
              ))}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const selectedTasks = getTasksForDate(selectedDate.getDate());

  return (
    <Card className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Calendar</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-ocean text-white border-primary hover:bg-primary-dark"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth("prev")}
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h4 className="font-semibold text-lg">
          {currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h4>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth("next")}
          className="h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendarGrid()}
      </div>

      {/* Selected Date Tasks */}
      {selectedTasks.length > 0 && (
        <div className="border-t pt-4">
          <h5 className="font-medium mb-2 text-sm text-muted-foreground">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </h5>
          <div className="space-y-2">
            {selectedTasks.map(task => (
              <div 
                key={task.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm"
              >
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  className="w-4 h-4 text-primary rounded"
                  onChange={() => {
                    setTasks(prev => prev.map(t => 
                      t.id === task.id ? { ...t, completed: !t.completed } : t
                    ));
                  }}
                />
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}