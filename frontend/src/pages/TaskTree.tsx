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

// Import achievement icons
import starIcon from "@/assets/icons/star.png";
import trophyIcon from "@/assets/icons/trophy.png";
import targetIcon from "@/assets/icons/target.png";
import lightningIcon from "@/assets/icons/lightning.png";
import selfCareIcon from "@/assets/icons/self-care.png";
import cleaningIcon from "@/assets/icons/cleaning.png";
import studyingIcon from "@/assets/icons/studying.png";
import exerciseIcon from "@/assets/icons/exercise.png";
import morningRoutineIcon from "@/assets/icons/morningroutine.png";
import meditateIcon from "@/assets/icons/meditate.png";
import focustimeIcon from "@/assets/icons/focustime.png";

interface TaskNode {
  id: string;
  title: string;
  description: string;
  icon?: React.ElementType;
  customIcon?: string;
  status: "completed" | "available" | "locked";
  position: { x: number; y: number };
  prerequisites?: string[];
  reward?: string;
}

const taskNodes: TaskNode[] = [
  // SELF CARE TREE (Left side - 20-30% x range)
  // Base
  { id: "self-care-base", title: "Self Care Basics", description: "Master daily self-care routines and build healthy habits", customIcon: selfCareIcon, status: "completed", position: { x: 20, y: 85 } },
  // Tier 1
  { id: "morning-routine", title: "Morning Routine", description: "Establish a consistent morning routine to start your day right", customIcon: morningRoutineIcon, status: "completed", position: { x: 15, y: 70 }, prerequisites: ["self-care-base"] },
  { id: "self-hygiene", title: "Hygiene Habits", description: "Build consistent personal hygiene routines", customIcon: selfCareIcon, status: "available", position: { x: 25, y: 70 }, prerequisites: ["self-care-base"] },
  // Tier 2
  { id: "exercise", title: "Exercise Routine", description: "Develop a sustainable fitness habit", customIcon: exerciseIcon, status: "locked", position: { x: 12, y: 55 }, prerequisites: ["morning-routine"] },
  { id: "nutrition", title: "Healthy Eating", description: "Create balanced meal planning and eating habits", customIcon: targetIcon, status: "locked", position: { x: 20, y: 55 }, prerequisites: ["morning-routine", "self-hygiene"] },
  { id: "sleep-hygiene", title: "Sleep Mastery", description: "Optimize sleep schedule and bedtime routines", customIcon: starIcon, status: "locked", position: { x: 28, y: 55 }, prerequisites: ["self-hygiene"] },
  // Tier 3
  { id: "mindfulness", title: "Mindfulness", description: "Develop meditation and stress management skills", customIcon: meditateIcon, status: "locked", position: { x: 20, y: 40 }, prerequisites: ["exercise", "nutrition", "sleep-hygiene"] },
  // Tier 4
  { id: "wellness-master", title: "Wellness Master", description: "Achieve holistic health and well-being", customIcon: trophyIcon, status: "locked", position: { x: 20, y: 25 }, prerequisites: ["mindfulness"] },
  // Tier 5
  { id: "life-coach", title: "Life Coach", description: "Help others develop their wellness journey", customIcon: starIcon, status: "locked", position: { x: 15, y: 10 }, prerequisites: ["wellness-master"] },
  { id: "wellness-influencer", title: "Wellness Influencer", description: "Inspire communities to live healthier lives", customIcon: lightningIcon, status: "locked", position: { x: 25, y: 10 }, prerequisites: ["wellness-master"] },

  // CHORES TREE (Center - 45-55% x range)
  // Base
  { id: "chores-base", title: "Basic Chores", description: "Master fundamental household maintenance tasks", customIcon: cleaningIcon, status: "available", position: { x: 50, y: 85 } },
  // Tier 1
  { id: "cleaning-basics", title: "Cleaning Basics", description: "Learn efficient cleaning techniques and routines", customIcon: cleaningIcon, status: "locked", position: { x: 45, y: 70 }, prerequisites: ["chores-base"] },
  { id: "laundry", title: "Laundry Management", description: "Organize washing, drying, and clothing care", customIcon: targetIcon, status: "locked", position: { x: 55, y: 70 }, prerequisites: ["chores-base"] },
  // Tier 2
  { id: "organization", title: "Home Organization", description: "Create and maintain organized living spaces", customIcon: starIcon, status: "locked", position: { x: 42, y: 55 }, prerequisites: ["cleaning-basics"] },
  { id: "maintenance", title: "Home Maintenance", description: "Handle basic repairs and upkeep tasks", customIcon: targetIcon, status: "locked", position: { x: 50, y: 55 }, prerequisites: ["cleaning-basics", "laundry"] },
  { id: "cooking", title: "Cooking Skills", description: "Develop meal preparation and kitchen management", customIcon: trophyIcon, status: "locked", position: { x: 58, y: 55 }, prerequisites: ["laundry"] },
  // Tier 3
  { id: "home-systems", title: "Home Systems", description: "Create efficient household management systems", customIcon: lightningIcon, status: "locked", position: { x: 50, y: 40 }, prerequisites: ["organization", "maintenance", "cooking"] },
  // Tier 4
  { id: "home-master", title: "Home Master", description: "Achieve complete household management mastery", customIcon: trophyIcon, status: "locked", position: { x: 50, y: 25 }, prerequisites: ["home-systems"] },
  // Tier 5
  { id: "home-designer", title: "Home Designer", description: "Create beautiful and functional living spaces", customIcon: starIcon, status: "locked", position: { x: 45, y: 10 }, prerequisites: ["home-master"] },
  { id: "household-guru", title: "Household Guru", description: "Become an expert who can optimize any living space", customIcon: trophyIcon, status: "locked", position: { x: 55, y: 10 }, prerequisites: ["home-master"] },

  // STUDYING TREE (Right side - 70-80% x range)
  // Base
  { id: "study-base", title: "Study Basics", description: "Learn fundamental study techniques and habits", customIcon: studyingIcon, status: "locked", position: { x: 80, y: 85 } },
  // Tier 1
  { id: "note-taking", title: "Note Taking", description: "Master effective note-taking strategies", customIcon: studyingIcon, status: "locked", position: { x: 75, y: 70 }, prerequisites: ["study-base"] },
  { id: "focus-skills", title: "Focus Training", description: "Develop concentration and attention skills", customIcon: focustimeIcon, status: "locked", position: { x: 85, y: 70 }, prerequisites: ["study-base"] },
  // Tier 2
  { id: "time-management", title: "Time Management", description: "Learn to organize study time effectively", customIcon: targetIcon, status: "locked", position: { x: 72, y: 55 }, prerequisites: ["note-taking"] },
  { id: "research-skills", title: "Research Skills", description: "Develop information gathering and analysis abilities", customIcon: lightningIcon, status: "locked", position: { x: 80, y: 55 }, prerequisites: ["note-taking", "focus-skills"] },
  { id: "memory-techniques", title: "Memory Techniques", description: "Master memorization and retention strategies", customIcon: starIcon, status: "locked", position: { x: 88, y: 55 }, prerequisites: ["focus-skills"] },
  // Tier 3
  { id: "advanced-study", title: "Advanced Study", description: "Integrate all study skills for maximum learning", customIcon: trophyIcon, status: "locked", position: { x: 80, y: 40 }, prerequisites: ["time-management", "research-skills", "memory-techniques"] },
  // Tier 4
  { id: "study-master", title: "Study Master", description: "Achieve mastery in learning and academic success", customIcon: trophyIcon, status: "locked", position: { x: 80, y: 25 }, prerequisites: ["advanced-study"] },
  // Tier 5
  { id: "knowledge-sage", title: "Knowledge Sage", description: "Become a master learner who can tackle any subject", customIcon: starIcon, status: "locked", position: { x: 75, y: 10 }, prerequisites: ["study-master"] },
  { id: "study-mentor", title: "Study Mentor", description: "Guide others in their learning journey", customIcon: lightningIcon, status: "locked", position: { x: 85, y: 10 }, prerequisites: ["study-master"] }
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
                <div
                  key={task.id}
                  className="absolute group"
                  style={{
                    left: `${task.position.x}%`,
                    top: `${task.position.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  {/* Achievement Badge Style Node */}
                  <Button
                    variant="outline"
                    className={cn(
                      "w-16 h-16 p-0 rounded-full transition-all duration-300 hover:scale-110 relative overflow-hidden",
                      "bg-ocean border-ocean",
                      available && task.status === "completed" && "shadow-glow",
                      !available && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => available && setSelectedTask(task)}
                    disabled={!available}
                  >
                    {/* Greyed-out overlay for locked tasks */}
                    {(!available || task.status === "locked") && (
                      <>
                        <div className="absolute inset-0 bg-black/50 rounded-full mix-blend-multiply z-10" />
                        <div className="absolute inset-0 bg-gray-500/40 rounded-full mix-blend-overlay z-10" />
                      </>
                    )}

                    {/* Task Icon */}
                    {task.customIcon ? (
                      <img
                        src={task.customIcon}
                        alt={task.title}
                        className="w-8 h-8 relative z-0"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      TaskIcon && <TaskIcon className="w-8 h-8 relative z-0 text-white" />
                    )}

                    {/* Status indicator */}
                    <StatusIcon className="w-3 h-3 absolute -top-1 -right-1 text-white z-20" />
                  </Button>

                  {/* Hover Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
                    <div className="bg-card-overlay backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/20 max-w-xs">
                      <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                      {(!available || task.status === "locked") && (
                        <p className="text-xs text-muted-foreground/70 mt-1 italic">
                          Complete prerequisites to unlock!
                        </p>
                      )}
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-card-overlay"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Task Details Panel */}
          {selectedTask && (
            <Card className="mt-6 p-6 glass-card">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden",
                  "bg-ocean border-ocean"
                )}>
                  {/* Greyed-out overlay for locked tasks */}
                  {selectedTask.status === "locked" && (
                    <>
                      <div className="absolute inset-0 bg-black/50 rounded-full mix-blend-multiply z-10" />
                      <div className="absolute inset-0 bg-gray-500/40 rounded-full mix-blend-overlay z-10" />
                    </>
                  )}

                  {selectedTask.customIcon ? (
                    <img
                      src={selectedTask.customIcon}
                      alt={selectedTask.title}
                      className="w-10 h-10 relative z-0"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    selectedTask.icon && <selectedTask.icon className="w-10 h-10 relative z-0 text-white" />
                  )}
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