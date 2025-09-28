import { cn } from "@/lib/utils";
import { Star, Trophy, Target, Zap, Award } from "lucide-react";
import { ReactNode } from "react";

interface AchievementBadgeProps {
  icon?: "star" | "trophy" | "target" | "zap" | "award" | "first-task" | "silver" | "gold";
  title: string;
  description?: string;
  isUnlocked?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const iconMap = {
  star: Star,
  trophy: Trophy,
  target: Target,
  zap: Zap,
  award: Award,
};

// Custom image icons
const customIconMap = {
  "first-task": "/placeholders/achievements/achievement-first-task-32x32.png",
  "gold": "/placeholders/achievements/gold_1_32x32.png",
  "silver": "/placeholders/achievements/silver_1_32x32.png",
};

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

const iconSizeClasses = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

const imageSizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export function AchievementBadge({
  icon = "star",
  title,
  description,
  isUnlocked = false,
  size = "md",
  className,
  onClick,
  children
}: AchievementBadgeProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap];
  const customIconPath = customIconMap[icon as keyof typeof customIconMap];
  const isCustomIcon = !!customIconPath;

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      {/* Badge Circle */}
      <div
        className={cn(
          "achievement-badge flex items-center justify-center rounded-full relative overflow-hidden",
          sizeClasses[size],
          "bg-ocean",
          isUnlocked ? "shadow-glow" : ""
        )}
        
      >
        {/* Greyed-out overlay for locked badges - placed before icons so they affect icons */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/50 rounded-full mix-blend-multiply z-10" />
        )}

        {/* Desaturate effect for locked badges - placed before icons */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gray-500/40 rounded-full mix-blend-overlay z-10" />
        )}

        {isCustomIcon ? (
          <img
            src={customIconPath}
            alt={title}
            className={cn(
              imageSizeClasses[size],
              "relative z-0",
              isUnlocked ? "opacity-100" : "opacity-100"
            )}
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          IconComponent && (
            <IconComponent
              className={cn(
                iconSizeClasses[size],
                "relative z-0",
                isUnlocked ? "text-white" : "text-white"
              )}
            />
          )
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
        <div className="bg-card-overlay backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/20 max-w-xs">
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {!isUnlocked && (
            <p className="text-xs text-muted-foreground/70 mt-1 italic">
              Locked - Complete tasks to unlock!
            </p>
          )}
        </div>
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card-overlay"></div>
      </div>

      {/* Unlock Animation */}
      {isUnlocked && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-success opacity-0 animate-pulse-glow"></div>
        </div>
      )}

      {children}
    </div>
  );
}