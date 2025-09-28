import { cn } from "@/lib/utils";

// Import category images
import selfCareImage from "@/assets/categories/self-care-64x64.png";
import studyingImage from "@/assets/categories/studying-64x64.png";
import cleaningPathImage from "@/assets/categories/cleaning-path-64x64.png";
import totalStreakImage from "@/assets/categories/total-streak-64x64.png";
import progressPlaceholder from "@/assets/images/progress-placeholder-64x64.png";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "accent" | "streak";
  showValue?: boolean;
  className?: string;
  label?: string;
  category?: string;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24", 
  lg: "w-32 h-32",
};

const strokeWidths = {
  sm: 3,
  md: 4,
  lg: 6,
};

const colorClasses = {
  primary: "stroke-primary",
  success: "stroke-success",
  accent: "stroke-accent",
  streak: "stroke-streak",
};

export function ProgressRing({
  progress,
  size = "md",
  color = "primary",
  showValue = true,
  className,
  label,
  category
}: ProgressRingProps) {
  const normalizedRadius = 45 - strokeWidths[size] * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  // Get image based on category
  const getImagePath = () => {
    if (!category) {
      return progressPlaceholder;
    }

    // Map category names to imported images
    const categoryMap: Record<string, string> = {
      "self care": selfCareImage,
      "studying": studyingImage,
      "cleaning path": cleaningPathImage,
      "total streak": totalStreakImage,
    };

    const categoryKey = category.toLowerCase();
    return categoryMap[categoryKey] || progressPlaceholder;
  };

  return (
    <div className={cn("progress-ring flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          className="w-full h-full transform -rotate-90"
          width="90"
          height="90"
        >
          {/* Background circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidths[size]}
            strokeDasharray={circumference + ' ' + circumference}
            r={normalizedRadius}
            cx="45"
            cy="45"
            className="opacity-20"
          />
          {/* Progress circle */}
          <circle
            fill="transparent"
            strokeWidth={strokeWidths[size]}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="45"
            cy="45"
            className={cn(colorClasses[color], "transition-all duration-700 ease-out")}
            style={{
              filter: 'drop-shadow(0 0 8px currentColor)',
            }}
          />
        </svg>
        
        {/* Pixel Art Character */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={getImagePath()}
            alt={category ? `${category} character` : "Character placeholder"}
            className={cn(
              "pixel-art",
              size === "sm" ? "w-8 h-8" : size === "md" ? "w-12 h-12" : "w-16 h-16"
            )}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        
        {/* Progress value overlay */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              "font-bold bg-card-overlay/80 rounded px-1 text-xs backdrop-blur-sm",
              "absolute -top-6"
            )}>
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      
      {/* Label */}
      {label && (
        <span className="text-sm font-medium text-muted-foreground text-center">
          {label}
        </span>
      )}
    </div>
  );
}