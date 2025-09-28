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
import { Footer } from "@/components/ui/footer";
import { Navigation } from "@/components/ui/navigation";
import { CalendarWidget } from "@/components/calendar-widget";
import { FocusTimer } from "@/components/ui/focus-timer";
import { StatsCard } from "@/components/ui/stats-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Target,
  ChevronRight
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
    { id: "4", title: "Early Bird", description: "Complete self care routine 5 times", isUnlocked: false, icon: "zap" as const },
  ];

  // Calculate streak progress (cap at 100% for display, target of 30 days for "mastery")
  const streakProgress = Math.min((streakData.currentDailyStreak / 30) * 100, 100);

  const inProgressTasks = [
    { title: "Self Care", progress: 75, color: "success" as const },
    { title: "Studying", progress: 45, color: "primary" as const },
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
    <div
      className="min-h-screen text-foreground relative flex flex-col"
      style={{
        backgroundImage: 'url(/placeholders/seabackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark theme overlay for proper brightness */}
      <div className="absolute inset-0 bg-black/57 dark:bg-black/67"></div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

        <main className="pt-24 px-4 pb-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section - keeping padding structure */}
          <div className="mb-8"></div>

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

          {/* Calendar Widget and Achievements */}
          <div className="mb-8 flex gap-6 items-start">
            {/* Calendar - 85% width */}
            <div className="w-[85%]">
              <CalendarWidget />
            </div>

            {/* Achievements Sidebar */}
            <div className="flex-1">
              <Card className="glass-card p-4 h-[738px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Achievements</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage("achievements")}
                    className="text-xs h-6 px-2"
                  >
                    View All
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                {/* Scrollable Achievement Grid */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {/* First Row */}
                    <AchievementBadge
                      icon="first-task"
                      title="First Steps"
                      description="Complete your first task"
                      isUnlocked={true}
                      size="sm"
                    />
                    <AchievementBadge
                      icon="silver"
                      title="Focus Starter"
                      description="Complete 5 focus sessions"
                      isUnlocked={true}
                      size="sm"
                    />

                    {/* Second Row */}
                    <AchievementBadge
                      icon="gold"
                      title="Morning Person"
                      description="Complete morning routine 5 times"
                      isUnlocked={false}
                      size="sm"
                    />
                    <AchievementBadge
                      icon="trophy"
                      title="Habit Builder"
                      description="Maintain 7-day streak"
                      isUnlocked={false}
                      size="sm"
                    />

                    {/* Third Row */}
                    <AchievementBadge
                      icon="target"
                      title="Task Master"
                      description="Complete 50 tasks"
                      isUnlocked={false}
                      size="sm"
                    />
                    <AchievementBadge
                      icon="star"
                      title="Consistency King"
                      description="Complete daily goals 14 days"
                      isUnlocked={false}
                      size="sm"
                    />

                    {/* Fourth Row */}
                    <AchievementBadge
                      icon="award"
                      title="Time Manager"
                      description="Use calendar 30 days"
                      isUnlocked={false}
                      size="sm"
                    />
                    <AchievementBadge
                      icon="zap"
                      title="Energy Boost"
                      description="Complete 3 tasks in one day"
                      isUnlocked={false}
                      size="sm"
                    />

                    {/* Fifth Row */}
                    <AchievementBadge
                      icon="first-task"
                      title="Self Care Hero"
                      description="Complete self care 10 times"
                      isUnlocked={false}
                      size="sm"
                    />
                    <AchievementBadge
                      icon="silver"
                      title="Study Champion"
                      description="Complete 25 study sessions"
                      isUnlocked={false}
                      size="sm"
                    />

                    {/* Sixth Row */}
                    <AchievementBadge
                      icon="gold"
                      title="Organization Pro"
                      description="Use calendar every day for 2 weeks"
                      isUnlocked={false}
                      size="sm"
                    />
                    <AchievementBadge
                      icon="trophy"
                      title="Ultimate Achiever"
                      description="Unlock 10 other achievements"
                      isUnlocked={false}
                      size="sm"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

        </div>
        <Footer onNavigate={setCurrentPage} />
      </main>
      </div>
    </div>
  );
};

export default Home;
