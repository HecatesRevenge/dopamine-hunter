import React, { useState } from "react";
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
  time: string; // Hour in 24h format, e.g., "09:00", "14:30"
  completed: boolean;
}

export function CalendarWidget({ className }: CalendarWidgetProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState<Date | null>(null); // Track which day is expanded
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Morning workout",
      date: new Date(),
      time: "08:00",
      completed: false,
    },
    {
      id: "2", 
      title: "Team meeting",
      date: new Date(),
      time: "10:30",
      completed: false,
    },
    {
      id: "3",
      title: "Project review",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "14:00",
      completed: false,
    },
  ]);

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const getHours = () => {
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
      hours.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  const getEightHourIncrements = () => {
    return ['00:00', '08:00', '16:00']; // Morning, Afternoon, Evening
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getTasksForDateTime = (date: Date, time: string) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear() &&
        task.time === time
      );
    });
  };

  const getTasksForTimeRange = (date: Date, startHour: number, endHour: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      const taskHour = parseInt(task.time.split(':')[0]);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear() &&
        taskHour >= startHour && taskHour < endHour
      );
    });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    // Toggle expanded day - if clicking the same day, collapse it
    if (expandedDay && 
        expandedDay.getDate() === day.getDate() && 
        expandedDay.getMonth() === day.getMonth() && 
        expandedDay.getFullYear() === day.getFullYear()) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  const renderWeeklyGrid = () => {
    const weekDays = getWeekDays();
    const timeSlots = expandedDay ? getHours() : getEightHourIncrements();
    const isExpanded = !!expandedDay;

    return (
      <div className={cn("grid gap-1", isExpanded ? "grid-cols-2" : "grid-cols-8")}>
        {/* Time column header */}
        <div className="text-xs font-medium text-muted-foreground p-2"></div>
        
        {/* Day headers - show all days or just expanded day */}
        {(isExpanded ? [expandedDay] : weekDays).map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => handleDayClick(day)}
            className={cn(
              "text-xs font-medium p-2 rounded-lg transition-all duration-200",
              "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
              isToday(day) && "bg-ocean text-white font-bold shadow-glow",
              isSelected(day) && !isToday(day) && "bg-primary/10 text-primary font-semibold",
              isExpanded && "bg-primary/20"
            )}
          >
            <div className="text-xs opacity-60">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="font-semibold">
              {day.getDate()}
            </div>
            {!isExpanded && (
              <div className="text-xs opacity-60 mt-1">
                Click for details
              </div>
            )}
          </button>
        ))}

        {/* Time slots and tasks */}
        {timeSlots.map(timeSlot => {
          const isEightHourSlot = !isExpanded;
          const startHour = parseInt(timeSlot.split(':')[0]);
          const endHour = isEightHourSlot ? startHour + 8 : startHour + 1;
          const timeLabel = isEightHourSlot ? 
            `${timeSlot} - ${(startHour + 8).toString().padStart(2, '0')}:00` : 
            timeSlot;

          return (
            <React.Fragment key={timeSlot}>
              {/* Time label */}
              <div className="text-xs text-muted-foreground p-2 border-r border-border/50">
                {timeLabel}
              </div>
              
              {/* Time slots for each day */}
              {(isExpanded ? [expandedDay!] : weekDays).map(day => {
                const dayTasks = isEightHourSlot ? 
                  getTasksForTimeRange(day, startHour, endHour) :
                  getTasksForDateTime(day, timeSlot);
                
                return (
                  <div
                    key={`${day.toISOString()}-${timeSlot}`}
                    className={cn(
                      "border border-border/20 rounded-sm relative group hover:bg-muted/30 transition-colors",
                      isEightHourSlot ? "h-16" : "h-12",
                      isToday(day) && "bg-ocean/5"
                    )}
                  >
                    {isEightHourSlot ? (
                      // 8-hour view: show task count or summary
                      dayTasks.length > 0 && (
                        <div className="absolute inset-1 bg-primary/20 border border-primary/40 rounded-sm p-1 flex flex-col justify-center">
                          <div className="text-xs text-primary font-medium text-center">
                            {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                          </div>
                          {dayTasks.slice(0, 2).map(task => (
                            <div key={task.id} className="text-xs text-primary/80 truncate">
                              {task.time} {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-primary/60">
                              +{dayTasks.length - 2} more
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      // 24-hour view: show individual tasks
                      dayTasks.map(task => (
                        <div
                          key={task.id}
                          className={cn(
                            "absolute inset-1 bg-primary/20 border border-primary/40 rounded-sm p-1",
                            "text-xs text-primary font-medium truncate",
                            task.completed && "opacity-50 line-through"
                          )}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))
                    )}
                    
                    {/* Add task button - shows on hover */}
                    <button className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5 text-primary text-xs flex items-center justify-center">
                      +
                    </button>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const selectedTasks = getTasksForDate(selectedDate);
  const weekDays = getWeekDays();
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

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

      {/* Week Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateWeek("prev")}
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h4 className="font-semibold text-lg">
          {currentWeekStart.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} - {currentWeekEnd.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </h4>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateWeek("next")}
          className="h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Weekly Calendar Grid with Hours */}
      <div className="max-h-96 overflow-y-auto border rounded-lg">
        {renderWeeklyGrid()}
      </div>

      {/* Expanded day controls */}
      {expandedDay && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Viewing detailed schedule for {expandedDay.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExpandedDay(null)}
          >
            Show All Days
          </Button>
        </div>
      )}

      {/* Selected Date Tasks */}
      {selectedTasks.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h5 className="font-medium mb-2 text-sm text-muted-foreground">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </h5>
          <div className="space-y-2">
            {selectedTasks
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(task => (
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
                <span className="text-xs text-muted-foreground min-w-12">
                  {task.time}
                </span>
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