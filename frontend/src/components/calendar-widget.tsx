import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    date: new Date(),
    time: "09:00",
    ampm: "AM"
  });
  const [tasks, setTasks] = useState<Task[]>([]);

  // Convert 24h time to 12h AM/PM format
  const convertTo12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return { time: `${hour12}:${minutes}`, ampm };
  };

  // Convert 12h AM/PM time to 24h format
  const convertTo24Hour = (time12: string, ampm: string) => {
    const [hours, minutes] = time12.split(':');
    let hour = parseInt(hours);

    if (ampm === 'AM' && hour === 12) {
      hour = 0;
    } else if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    }

    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  // Format time for display
  const formatTimeForDisplay = (time24: string) => {
    const { time, ampm } = convertTo12Hour(time24);
    return `${time} ${ampm}`;
  };

  // Add new task
  const handleAddTask = () => {
    const time24 = convertTo24Hour(newTask.time, newTask.ampm);
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      date: new Date(newTask.date),
      time: time24,
      completed: false
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: "",
      date: new Date(),
      time: "09:00",
      ampm: "AM"
    });
    setIsAddTaskOpen(false);
  };

  // Generate time options for select
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour}:${minute.toString().padStart(2, '0')}`;
        times.push(timeStr);
      }
    }
    return times;
  };

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

  const getFourHourIncrements = () => {
    return ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']; // 6 time slots of 4 hours each
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
    const timeSlots = expandedDay ? getHours() : getFourHourIncrements();
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
          const isFourHourSlot = !isExpanded;
          const startHour = parseInt(timeSlot.split(':')[0]);
          const endHour = isFourHourSlot ? startHour + 4 : startHour + 1;

          // Format time labels in AM/PM
          const timeLabel = isFourHourSlot ?
            `${formatTimeForDisplay(timeSlot)} - ${formatTimeForDisplay(`${(startHour + 4).toString().padStart(2, '0')}:00`)}` :
            formatTimeForDisplay(timeSlot);

          return (
            <React.Fragment key={timeSlot}>
              {/* Time label */}
              <div className="text-xs text-muted-foreground p-2 border-r border-border/50">
                {timeLabel}
              </div>
              
              {/* Time slots for each day */}
              {(isExpanded ? [expandedDay!] : weekDays).map(day => {
                const dayTasks = isFourHourSlot ?
                  getTasksForTimeRange(day, startHour, endHour) :
                  getTasksForDateTime(day, timeSlot);
                
                return (
                  <div
                    key={`${day.toISOString()}-${timeSlot}`}
                    className={cn(
                      "border border-border/20 rounded-sm relative group hover:bg-muted/30 transition-colors",
                      isFourHourSlot ? "h-20" : "h-12",
                      isToday(day) && "bg-ocean/5"
                    )}
                  >
                    {isFourHourSlot ? (
                      // 4-hour view: show task count or summary
                      dayTasks.length > 0 && (
                        <div className="absolute inset-1 bg-primary/20 border border-primary/40 rounded-sm p-1 flex flex-col justify-center">
                          <div className="text-xs text-primary font-medium text-center">
                            {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                          </div>
                          {dayTasks.slice(0, 2).map(task => (
                            <div key={task.id} className="text-xs text-primary/80 truncate">
                              {formatTimeForDisplay(task.time)} {task.title}
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
    <Card className={cn("glass-card p-6 h-[738px] flex flex-col", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Calendar</h3>
        </div>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-ocean text-white border-primary hover:bg-primary-dark"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="col-span-3"
                  placeholder="Enter task title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newTask.date.toISOString().split('T')[0]}
                  onChange={(e) => setNewTask(prev => ({ ...prev, date: new Date(e.target.value) }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Select
                    value={newTask.time}
                    onValueChange={(value) => setNewTask(prev => ({ ...prev, time: value }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeOptions().map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newTask.ampm}
                    onValueChange={(value) => setNewTask(prev => ({ ...prev, ampm: value }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddTaskOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTask}
                disabled={!newTask.title.trim()}
                className="bg-ocean hover:bg-primary-dark"
              >
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
      <div className="flex-1 overflow-y-auto border rounded-lg min-h-0">
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
                <span className="text-xs text-muted-foreground min-w-16">
                  {formatTimeForDisplay(task.time)}
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