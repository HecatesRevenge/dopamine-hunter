import { cn } from "@/lib/utils";
import { Star, Trophy, Target, Zap, Award } from "lucide-react";
import { ReactNode } from "react";

// Import all achievement icons
import lightningIcon from "@/assets/icons/lightning.png";
import starIcon from "@/assets/icons/star.png";
import trophyIcon from "@/assets/icons/trophy.png";
import targetIcon from "@/assets/icons/target.png";
import focustimeIcon from "@/assets/icons/focustime.png";
import cleaningIcon from "@/assets/icons/cleaning.png";
import selfCareIcon from "@/assets/icons/self-care.png";
import studyingIcon from "@/assets/icons/studying.png";
import totalStreakIcon from "@/assets/icons/total-streak.png";
import algaeIcon from "@/assets/icons/algae.png";
import crabIcon from "@/assets/icons/crab.png";
import sharkIcon from "@/assets/icons/shark.png";
import seaturtleIcon from "@/assets/icons/seaturtle.png";
import snail2Icon from "@/assets/icons/snail2.png";
import anglerIcon from "@/assets/icons/angler.png";
import pufferIcon from "@/assets/icons/puffer.png";

interface AchievementBadgeProps {
  icon?: "star" | "trophy" | "target" | "zap" | "award" | "first-task" | "silver" | "gold" | "bronze" | "cleaning" | "self-care" | "studying" | "total-streak" | "algae" | "crab" | "shark" | "seaturtle" | "snail2" | "angler" | "puffer";
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

// Custom image icons mapped to imported assets
const customIconMap = {
  "first-task": lightningIcon,
  "gold": trophyIcon,
  "silver": starIcon,
  "bronze": targetIcon,
  "star": starIcon,
  "trophy": trophyIcon,
  "target": targetIcon,
  "zap": lightningIcon,
  "award": focustimeIcon,
  "cleaning": cleaningIcon,
  "self-care": selfCareIcon,
  "studying": studyingIcon,
  "total-streak": totalStreakIcon,
  "algae": algaeIcon,
  "crab": crabIcon,
  "shark": sharkIcon,
  "seaturtle": seaturtleIcon,
  "snail2": snail2Icon,
  "angler": anglerIcon,
  "puffer": pufferIcon,
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
  const customIconPath = customIconMap[icon as keyof typeof customIconMap];
  const IconComponent = iconMap[icon as keyof typeof iconMap];
  const isCustomIcon = !!customIconPath;

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-300 hover:z-[200]",
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
              isUnlocked ? "opacity-100" : "opacity-60 grayscale"
            )}
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          IconComponent && (
            <IconComponent
              className={cn(
                iconSizeClasses[size],
                "relative z-0",
                isUnlocked ? "text-white" : "text-white opacity-60"
              )}
            />
          )
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[9999]">
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
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-card-overlay"></div>
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