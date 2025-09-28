/*
 * IMPORTANT BACKEND INTEGRATION NOTE:
 *
 * The streak counter is currently set to increment on every page refresh for testing.
 * When integrating with the backend:
 *
 * 1. REMOVE the temporary increment logic (lines 46-59)
 * 2. RESTORE the commented original logic (lines 61-88)
 * 3. REPLACE the mock API call with real backend endpoint
 *
 * See /frontend-documentation/backend-integration.md for complete integration guide.
 */

import { useState, useEffect } from "react";
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
  const [streakData, setStreakData] = useState({
    totalVisits: 0,
    currentDailyStreak: 0,
    bestStreak: 0,
    lastVisitDate: null as string | null
  });

  // Mock API function - Backend team will replace this
  const updateStreakCounter = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/users/current/streak/visit', { method: 'POST' });
    // const data = await response.json();

    // Mock implementation for now
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('streakData');
    let currentData = savedData ? JSON.parse(savedData) : {
      totalVisits: 0,
      currentDailyStreak: 0,
      bestStreak: 0,
      lastVisitDate: null
    };

    // TEMPORARY: Increment on every page refresh for testing
    // TODO: Remove this when backend is integrated - should only increment once per day

    // Always increment for demo purposes
    currentData.currentDailyStreak += 1;
    currentData.totalVisits += 1;
    currentData.lastVisitDate = today;

    // Update best streak
    if (currentData.currentDailyStreak > currentData.bestStreak) {
      currentData.bestStreak = currentData.currentDailyStreak;
    }

    localStorage.setItem('streakData', JSON.stringify(currentData));

    /* ORIGINAL CODE - Restore when backend is ready:
    if (currentData.lastVisitDate !== today) {
      // New day visit
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (currentData.lastVisitDate === yesterday.toDateString()) {
        // Consecutive day - increment streak
        currentData.currentDailyStreak += 1;
      } else if (currentData.lastVisitDate !== null) {
        // Missed a day - reset streak
        currentData.currentDailyStreak = 1;
      } else {
        // First visit
        currentData.currentDailyStreak = 1;
      }

      currentData.totalVisits += 1;
      currentData.lastVisitDate = today;

      // Update best streak
      if (currentData.currentDailyStreak > currentData.bestStreak) {
        currentData.bestStreak = currentData.currentDailyStreak;
      }

      localStorage.setItem('streakData', JSON.stringify(currentData));
    }
    */

    setStreakData(currentData);
    return currentData;
  };

  // Track page visit on component mount
  useEffect(() => {
    updateStreakCounter();
  }, []);

  const recentAchievements = [
    { id: "1", title: "First Steps", description: "Complete your first task", isUnlocked: true, icon: "star" as const },
    { id: "2", title: "Streak Master", description: "Maintain a 7-day streak", isUnlocked: true, icon: "trophy" as const },
    { id: "3", title: "Focus Champion", description: "Complete 10 focus sessions", isUnlocked: false, icon: "target" as const },
    { id: "4", title: "Early Bird", description: "Complete morning routine 5 times", isUnlocked: false, icon: "zap" as const },
  ];

  // Calculate streak progress (cap at 100% for display, target of 30 days for "mastery")
  const streakProgress = Math.min((streakData.currentDailyStreak / 30) * 100, 100);

  const inProgressTasks = [
    { title: "Morning Routine", progress: 75, color: "success" as const },
    { title: "Study Session", progress: 45, color: "primary" as const },
    { title: "Cleaning Path", progress: 90, color: "accent" as const },
    {
      title: "Total Streak",
      progress: streakProgress,
      color: "streak" as const,
      streakData: {
        current: streakData.currentDailyStreak,
        best: streakData.bestStreak,
        total: streakData.totalVisits
      }
    },
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
