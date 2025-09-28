import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Lock,
  Target,
  BookOpen,
  Trophy,
  Star,
  Zap,
  Clock,
  Users,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface TaskNode {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "completed" | "available" | "locked";
  position: { x: number; y: number };
  prerequisites?: string[];
  reward?: string;
}

const taskNodes: TaskNode[] = [
  // Foundation tier
  { id: "start", title: "Getting Started", description: "Welcome to TaskQuest", icon: Target, status: "completed", position: { x: 50, y: 90 } },
  { id: "basics", title: "Learn Basics", description: "Master the fundamentals", icon: BookOpen, status: "completed", position: { x: 20, y: 70 }, prerequisites: ["start"] },
  { id: "first-goal", title: "Set First Goal", description: "Define your objective", icon: Star, status: "available", position: { x: 80, y: 70 }, prerequisites: ["start"] },
  
  // Skill development tier
  { id: "time-mgmt", title: "Time Management", description: "Learn to organize your time", icon: Clock, status: "available", position: { x: 15, y: 50 }, prerequisites: ["basics"] },
  { id: "focus-skills", title: "Focus Training", description: "Improve concentration", icon: Zap, status: "locked", position: { x: 50, y: 50 }, prerequisites: ["basics", "first-goal"] },
  { id: "productivity", title: "Productivity Boost", description: "Enhance your workflow", icon: Settings, status: "locked", position: { x: 85, y: 50 }, prerequisites: ["first-goal"] },
  
  // Advanced tier
  { id: "teamwork", title: "Collaboration", description: "Work effectively with others", icon: Users, status: "locked", position: { x: 25, y: 30 }, prerequisites: ["time-mgmt", "focus-skills"] },
  { id: "mastery", title: "Skill Mastery", description: "Achieve expertise level", icon: Trophy, status: "locked", position: { x: 70, y: 30 }, prerequisites: ["focus-skills", "productivity"] },
  
  // Expert tier
  { id: "leadership", title: "Leadership", description: "Guide and inspire others", icon: Star, status: "locked", position: { x: 50, y: 10 }, prerequisites: ["teamwork", "mastery"] }
];

const TaskTree: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<TaskNode | null>(null);
  const [isNavHidden, setIsNavHidden] = useState(false);

  useEffect(() => {
    // Handle scroll to hide navigation when crossing the task tree header
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Hide navigation when scrolled past the header area (around 120px)
      // This is approximately when the nav would start overlapping the task tree header
      setIsNavHidden(scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (pageId: string) => {
    if (pageId === "home") {
      navigate("/");
    }
    // Handle other navigation items as needed
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground border-success";
      case "available": return "bg-primary text-primary-foreground border-primary";
      case "locked": return "bg-muted text-muted-foreground border-muted";
      default: return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle2;
      case "available": return Target;
      case "locked": return Lock;
      default: return Lock;
    }
  };

  const isTaskAvailable = (task: TaskNode) => {
    if (task.status === "completed") return true;
    if (!task.prerequisites) return task.status === "available";
    return task.prerequisites.every(prereq => 
      taskNodes.find(node => node.id === prereq)?.status === "completed"
    );
  };

  const drawConnections = () => {
    return taskNodes.map(node => {
      if (!node.prerequisites) return null;
      
      return node.prerequisites.map(prereqId => {
        const prereq = taskNodes.find(n => n.id === prereqId);
        if (!prereq) return null;
        
        const x1 = prereq.position.x;
        const y1 = prereq.position.y;
        const x2 = node.position.x;
        const y2 = node.position.y;
        
        return (
          <line
            key={`${prereqId}-${node.id}`}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke="hsl(var(--primary) / 0.3)"
            strokeWidth="2"
            strokeDasharray={node.status === "locked" ? "5,5" : "none"}
          />
        );
      });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-deep via-ocean to-primary/20">
      <Navigation currentPage="task-tree" onNavigate={handleNavigate} />
      
      <main className="container mx-auto px-4 pt-32 pb-32">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Task Tree
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Progress through your learning journey. Complete tasks to unlock new challenges and build your skills.
          </p>
        </div>

        <div className="relative">
          {/* Task Tree Visualization */}
          <div className="relative w-full h-[600px] bg-gradient-to-br from-background/50 to-background/80 rounded-xl border border-border/50 backdrop-blur-sm overflow-hidden">
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {drawConnections()}
            </svg>
            
            {/* Task nodes */}
            {taskNodes.map((task) => {
              const StatusIcon = getStatusIcon(task.status);
              const TaskIcon = task.icon;
              const available = isTaskAvailable(task);
              
              return (
                <Button
                  key={task.id}
                  variant="outline"
                  className={cn(
                    "absolute w-16 h-16 p-0 rounded-xl transition-all duration-300 hover:scale-110",
                    getNodeColor(available ? task.status : "locked"),
                    !available && "opacity-50 cursor-not-allowed"
                  )}
                  style={{
                    left: `${task.position.x}%`,
                    top: `${task.position.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  onClick={() => available && setSelectedTask(task)}
                  disabled={!available}
                >
                  <div className="relative">
                    <TaskIcon className="w-6 h-6" />
                    <StatusIcon className="w-3 h-3 absolute -top-1 -right-1" />
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Task Details Panel */}
          {selectedTask && (
            <Card className="mt-6 p-6 glass-card">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center",
                  getNodeColor(selectedTask.status)
                )}>
                  <selectedTask.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{selectedTask.title}</h3>
                    <Badge variant={selectedTask.status === "completed" ? "default" : "secondary"}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{selectedTask.description}</p>
                  
                  {selectedTask.prerequisites && selectedTask.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Prerequisites:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.prerequisites.map(prereqId => {
                          const prereq = taskNodes.find(n => n.id === prereqId);
                          return prereq ? (
                            <Badge key={prereqId} variant="outline">
                              {prereq.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {selectedTask.reward && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Reward:</h4>
                      <Badge variant="secondary">{selectedTask.reward}</Badge>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {selectedTask.status === "available" && (
                      <Button className="bg-primary hover:bg-primary-dark">
                        Start Task
                      </Button>
                    )}
                    {selectedTask.status === "completed" && (
                      <Button variant="outline">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Completed
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => setSelectedTask(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default TaskTree;