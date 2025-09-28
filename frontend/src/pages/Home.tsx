import { useState } from "react";
import { Navigation } from "../components/ui/navigation";
import { CalendarWidget } from "../components/calendar-widget";
import { FocusTimer } from "../components/ui/focus-timer";
import { StatsCard } from "../components/ui/stats-card";
import { ProgressRing } from "../components/ui/progress-ring";
import { AchievementBadge } from "../components/ui/achievement-badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Flame,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Star,
  ChevronRight,
  Zap,
} from "lucide-react";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const recentAchievements = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first task",
      isUnlocked: true,
      icon: "star" as const,
    },
    {
      id: "2",
      title: "Streak Master",
      description: "Maintain a 7-day streak",
      isUnlocked: true,
      icon: "trophy" as const,
    },
    {
      id: "3",
      title: "Focus Champion",
      description: "Complete 10 focus sessions",
      isUnlocked: false,
      icon: "target" as const,
    },
    {
      id: "4",
      title: "Early Bird",
      description: "Complete morning routine 5 times",
      isUnlocked: false,
      icon: "zap" as const,
    },
  ];

  const inProgressTasks = [
    { title: "Morning Routine", progress: 75, color: "success" as const },
    { title: "Study Session", progress: 45, color: "primary" as const },
    { title: "Exercise", progress: 90, color: "accent" as const },
    { title: "Meditation", progress: 30, color: "streak" as const },
  ];

       

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-poppins mb-2">
              Welcome back!
              <span className="ml-2 text-2xl">🎯</span>
            </h1>
            <p className="text-muted-foreground">
              Ready to tackle your goals? Let's make today productive and
              rewarding!
            </p>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {/* Left Column - In-Progress Tasks & Calendar */}
            <div className="xl:col-span-2 space-y-6">
              {/* In-Progress Tasks */}
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">In-Progress</h3>
                  </div>
                  
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {inProgressTasks.map((task, index) => (
                    <ProgressRing
                      key={index}
                      progress={task.progress}
                      color={task.color}
                      label={task.title}
                      size="md"
                      className="hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </Card>

              <CalendarWidget />
            
            </div>
          </div>

          {/* Recent Achievements Section */}
          <Card className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Recent Achievements</h3>
              </div>
              <Button variant="ghost" size="sm">
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  icon={achievement.icon}
                  title={achievement.title}
                  description={achievement.description}
                  isUnlocked={achievement.isUnlocked}
                  size="lg"
                  className="flex-shrink-0"
                />
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="h-16 bg-ocean text-white border-primary hover:bg-primary-dark"
              onClick={() => setCurrentPage("pathways")}
            >
              <Target className="w-5 h-5 mr-2" />
              View Pathways
            </Button>

            <Button
              className="h-16 bg-achievement text-white border-success hover:bg-success/90"
              onClick={() => setCurrentPage("achievements")}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Achievements
            </Button>

            <Button
              className="h-16 bg-energy text-white border-accent hover:bg-accent/90"
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
