import React, { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import {
  Filter,
  Trophy,
  Star,
  Target,
  Zap,
  Award,
  CheckCircle2,
  Lock,
  Calendar,
  User,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Import background image
import seaBackground from "@/assets/images/seabackground.png";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "Self Care" | "Chores" | "Study" | "Social" | "General";
  icon: "star" | "trophy" | "target" | "zap" | "award" | "first-task" | "silver" | "gold" | "bronze" | "cleaning" | "self-care" | "studying" | "total-streak" | "algae" | "crab" | "shark" | "seaturtle" | "snail2" | "angler" | "puffer";
  isUnlocked: boolean;
  unlockedDate?: string;
  rarity: "common" | "uncommon" | "rare" | "epic";
  progress?: { current: number; total: number };
}

const achievements: Achievement[] = [
  // Self Care Achievements
  { id: "1", title: "First Steps", description: "Complete your first self-care task", category: "Self Care", icon: "algae", isUnlocked: true, unlockedDate: "2024-09-20", rarity: "common" },
  { id: "2", title: "Morning Person", description: "Complete morning routine 5 times", category: "Self Care", icon: "self-care", isUnlocked: true, unlockedDate: "2024-09-22", rarity: "uncommon" },
  { id: "3", title: "Self Care Hero", description: "Complete self care routine 10 times", category: "Self Care", icon: "star", isUnlocked: false, rarity: "rare", progress: { current: 7, total: 10 } },
  { id: "4", title: "Wellness Warrior", description: "Maintain perfect self-care for 30 days", category: "Self Care", icon: "trophy", isUnlocked: false, rarity: "epic", progress: { current: 12, total: 30 } },
  { id: "5", title: "Mindful Master", description: "Complete 100 meditation sessions", category: "Self Care", icon: "self-care", isUnlocked: false, rarity: "rare", progress: { current: 23, total: 100 } },

  // Chores Achievements
  { id: "6", title: "Clean Slate", description: "Complete your first cleaning task", category: "Chores", icon: "cleaning", isUnlocked: true, unlockedDate: "2024-09-18", rarity: "common" },
  { id: "7", title: "Organization Pro", description: "Organize 5 different spaces", category: "Chores", icon: "target", isUnlocked: false, rarity: "uncommon", progress: { current: 3, total: 5 } },
  { id: "8", title: "Household Hero", description: "Complete 50 household tasks", category: "Chores", icon: "cleaning", isUnlocked: false, rarity: "rare", progress: { current: 31, total: 50 } },
  { id: "9", title: "Master Chef", description: "Cook 25 meals from scratch", category: "Chores", icon: "angler", isUnlocked: false, rarity: "uncommon", progress: { current: 8, total: 25 } },

  // Study Achievements
  { id: "10", title: "Study Starter", description: "Complete your first study session", category: "Study", icon: "crab", isUnlocked: true, unlockedDate: "2024-09-25", rarity: "common" },
  { id: "11", title: "Focus Champion", description: "Complete 10 focus sessions", category: "Study", icon: "zap", isUnlocked: true, unlockedDate: "2024-09-27", rarity: "uncommon" },
  { id: "12", title: "Study Champion", description: "Complete 25 study sessions", category: "Study", icon: "shark", isUnlocked: false, rarity: "rare", progress: { current: 18, total: 25 } },
  { id: "13", title: "Knowledge Seeker", description: "Study for 100 hours total", category: "Study", icon: "trophy", isUnlocked: false, rarity: "epic", progress: { current: 42, total: 100 } },

  // Social Achievements
  { id: "14", title: "Social Butterfly", description: "Complete 5 social activities", category: "Social", icon: "snail2", isUnlocked: false, rarity: "uncommon", progress: { current: 2, total: 5 } },
  { id: "15", title: "Team Player", description: "Collaborate on 10 group tasks", category: "Social", icon: "seaturtle", isUnlocked: false, rarity: "rare", progress: { current: 0, total: 10 } },

  // General Achievements
  { id: "16", title: "Streak Master", description: "Maintain a 7-day streak", category: "General", icon: "puffer", isUnlocked: true, unlockedDate: "2024-09-21", rarity: "uncommon" },
  { id: "17", title: "Consistency King", description: "Complete daily goals for 14 days", category: "General", icon: "total-streak", isUnlocked: false, rarity: "rare", progress: { current: 9, total: 14 } },
  { id: "18", title: "Time Manager", description: "Use calendar for 30 days", category: "General", icon: "target", isUnlocked: false, rarity: "uncommon", progress: { current: 15, total: 30 } },
  { id: "19", title: "Ultimate Achiever", description: "Unlock 15 other achievements", category: "General", icon: "trophy", isUnlocked: false, rarity: "epic", progress: { current: 6, total: 15 } },
  { id: "20", title: "Energy Boost", description: "Complete 3 tasks in one day", category: "General", icon: "zap", isUnlocked: true, unlockedDate: "2024-09-19", rarity: "common" }
];

const categories = ["All", "Self Care", "Chores", "Study", "Social", "General"];
const rarityColors = {
  common: "text-gray-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400"
};

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const handleNavigate = (pageId: string) => {
    if (pageId === "home") {
      navigate("/");
    } else if (pageId === "task-tree") {
      navigate("/task-tree");
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === "All" || achievement.category === selectedCategory;
    const unlockedMatch = !showUnlockedOnly || achievement.isUnlocked;
    return categoryMatch && unlockedMatch;
  });

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div
      className="min-h-screen text-foreground relative flex flex-col"
      style={{
        backgroundImage: `url(${seaBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        filter: 'brightness(0.94)'
      }}
    >
      {/* Dark theme overlay */}
      <div className="absolute inset-0 bg-black/53 dark:bg-black/63"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation currentPage="achievements" onNavigate={handleNavigate} />

        <main className="pt-32 px-4 flex-1">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 bg-clip-text text-transparent">
                Achievements
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {unlockedCount} / {totalCount} Unlocked
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {completionPercentage}% Complete
                </Badge>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Sidebar Filters */}
              <div className="w-64 space-y-4">
                <Card className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Filters</h3>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2 mb-6">
                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <Button
                      variant={!showUnlockedOnly ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowUnlockedOnly(false)}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      All Achievements
                    </Button>
                    <Button
                      variant={showUnlockedOnly ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowUnlockedOnly(true)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Unlocked Only
                    </Button>
                  </div>
                </Card>

                {/* Stats Card */}
                <Card className="glass-card p-4">
                  <h3 className="font-semibold mb-4">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Common</span>
                      <span className="text-sm text-gray-400">
                        {achievements.filter(a => a.rarity === "common" && a.isUnlocked).length} / {achievements.filter(a => a.rarity === "common").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Uncommon</span>
                      <span className="text-sm text-green-400">
                        {achievements.filter(a => a.rarity === "uncommon" && a.isUnlocked).length} / {achievements.filter(a => a.rarity === "uncommon").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Rare</span>
                      <span className="text-sm text-blue-400">
                        {achievements.filter(a => a.rarity === "rare" && a.isUnlocked).length} / {achievements.filter(a => a.rarity === "rare").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Epic</span>
                      <span className="text-sm text-purple-400">
                        {achievements.filter(a => a.rarity === "epic" && a.isUnlocked).length} / {achievements.filter(a => a.rarity === "epic").length}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Achievements Grid */}
              <div className="flex-1">
                <div className="grid gap-4">
                  {filteredAchievements.map(achievement => (
                    <Card key={achievement.id} className={cn(
                      "glass-card p-4 transition-all hover:shadow-lg",
                      achievement.isUnlocked ? "border-primary/30" : "border-muted/30"
                    )}>
                      <div className="flex items-start gap-4">
                        {/* Achievement Icon */}
                        <div className="relative">
                          <AchievementBadge
                            icon={achievement.icon}
                            title={achievement.title}
                            description={achievement.description}
                            isUnlocked={achievement.isUnlocked}
                            size="md"
                          />
                        </div>

                        {/* Achievement Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className={cn(
                                "text-lg font-semibold text-foreground",
                                !achievement.isUnlocked && "opacity-70"
                              )}>
                                {achievement.title}
                              </h3>
                              <p className={cn(
                                "text-sm",
                                achievement.isUnlocked ? "text-muted-foreground" : "text-muted-foreground/70"
                              )}>
                                {achievement.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                variant="outline"
                                className={cn("text-xs", rarityColors[achievement.rarity])}
                              >
                                {achievement.rarity}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {achievement.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Progress Bar for Locked Achievements */}
                          {!achievement.isUnlocked && achievement.progress && (
                            <div className="mb-2">
                              <div className="text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary rounded-full h-2 transition-all"
                                  style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Unlock Date */}
                          {achievement.isUnlocked && achievement.unlockedDate && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>Unlocked on {achievement.unlockedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {filteredAchievements.length === 0 && (
                  <Card className="glass-card p-8 text-center">
                    <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters to see more achievements.</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default Achievements;