import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FocusTimer } from "@/components/ui/focus-timer";
import { StatsCard } from "@/components/ui/stats-card";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { Card } from "@/components/ui/card";
import { 
  ChevronRight, 
  Flame, 
  Trophy, 
  Clock, 
  Star
} from "lucide-react";

interface QuickAccessDrawerProps {
  className?: string;
}

export function QuickAccessDrawer({ className }: QuickAccessDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const recentAchievements = [
    { id: "1", title: "First Steps", description: "Complete your first task", isUnlocked: true, icon: "star" as const },
    { id: "2", title: "Streak Master", description: "Maintain a 7-day streak", isUnlocked: true, icon: "trophy" as const },
    { id: "3", title: "Focus Champion", description: "Complete 10 focus sessions", isUnlocked: false, icon: "target" as const },
    { id: "4", title: "Early Bird", description: "Complete morning routine 5 times", isUnlocked: false, icon: "zap" as const },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 border border-muted-foreground/30 hover:bg-muted/50 transition-colors rounded-md"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-96 max-w-[90vw] bg-background/95 backdrop-blur-md border-border/50">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Quick Access
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {/* Focus Timer */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Focus Timer</h3>
            <FocusTimer />
          </div>

          {/* Stats Cards */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Your Stats</h3>
            <div className="space-y-3">
              <StatsCard
                title="Current Streak"
                value="7 days"
                subtitle="Keep it up!"
                variant="streak"
                icon={<Flame className="w-6 h-6" />}
                backgroundImage="/placeholders/banners/current-streak-banner-400x80.png"
              />

              <StatsCard
                title="Best Streak"
                value="14 days"
                subtitle="Personal record"
                variant="achievement"
                icon={<Trophy className="w-6 h-6" />}
                backgroundImage="/placeholders/banners/best-streak-banner-400x80.png"
              />

              <StatsCard
                title="Focus Time"
                value="4.5h"
                subtitle="today"
                icon={<Clock className="w-5 h-5" />}
                variant="energy"
                backgroundImage="/placeholders/banners/focus-time-banner-400x80.png"
              />
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Recent Achievements</h3>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                View all
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <AchievementBadge
                    icon={achievement.icon}
                    title={achievement.title}
                    description={achievement.description}
                    isUnlocked={achievement.isUnlocked}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}