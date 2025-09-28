import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { CalendarWidget } from "@/components/calendar-widget";
import { FocusTimer } from "@/components/ui/focus-timer";
import { StatsCard } from "@/components/ui/stats-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Flame, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Star,
  ChevronRight,
  Zap
} from "lucide-react";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const recentAchievements = [
    { id: "1", title: "First Steps", description: "Complete your first task", isUnlocked: true, icon: "star" as const },
    { id: "2", title: "Streak Master", description: "Maintain a 7-day streak", isUnlocked: true, icon: "trophy" as const },
    { id: "3", title: "Focus Champion", description: "Complete 10 focus sessions", isUnlocked: false, icon: "target" as const },
    { id: "4", title: "Early Bird", description: "Complete morning routine 5 times", isUnlocked: false, icon: "zap" as const },
  ];

  const inProgressTasks = [
    { title: "Morning Routine", progress: 75, color: "success" as const },
    { title: "Study Session", progress: 45, color: "primary" as const },
    { title: "Cleaning Tasks", progress: 90, color: "accent" as const },
    { title: "Meditation", progress: 30, color: "streak" as const },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section - keeping padding structure */}
          <div className="mb-8">
          </div>

          {/* In-Progress Tasks */}
          <Card className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">In-Progress</h3>
              </div>
              <Button variant="ghost" size="sm">
                View more
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {inProgressTasks.map((task, index) => (
                <ProgressRing
                  key={index}
                  progress={task.progress}
                  color={task.color}
                  label={task.title}
                  category={task.title}
                  size="md"
                  className="hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          </Card>

          {/* Calendar Widget */}
          <div className="mb-8">
            <CalendarWidget />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-16 bg-primary hover:bg-primary-dark text-primary-foreground border-primary"
              onClick={() => setCurrentPage("pathways")}
            >
              <Target className="w-5 h-5 mr-2" />
              View Pathways
            </Button>
            
            <Button 
              className="h-16 bg-success hover:bg-success/90 text-success-foreground border-success"
              onClick={() => setCurrentPage("achievements")}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Achievements
            </Button>
            
            <Button 
              className="h-16 bg-accent hover:bg-accent/90 text-accent-foreground border-accent"
              onClick={() => setCurrentPage("minigame")}
            >
              <Zap className="w-5 h-5 mr-2" />
              Fish Minigame
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
