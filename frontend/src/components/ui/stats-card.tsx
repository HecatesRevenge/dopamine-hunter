import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: "default" | "streak" | "achievement" | "energy";
  className?: string;
  children?: ReactNode;
  backgroundImage?: string;
}

const variantClasses = {
  default: "bg-card border-border",
  streak: "bg-streak text-white border-streak",
  achievement: "bg-achievement text-white border-success",
  energy: "bg-energy text-white border-accent",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  className,
  children,
  backgroundImage
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "p-4 transition-all duration-300 hover:shadow-game hover:scale-105 relative overflow-hidden",
        backgroundImage ? "text-white" : variantClasses[variant],
        className
      )}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated'
      } : undefined}
    >
      {/* Background overlay for text readability when using background image */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-lg" />
      )}

      <div className="relative z-10 flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className={cn(
            "text-sm font-medium mb-1",
            backgroundImage ? "text-white/90 drop-shadow-sm" :
            variant === "default" ? "text-muted-foreground" : "text-white/80"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-2xl font-bold font-poppins",
            backgroundImage ? "text-white drop-shadow-md" : ""
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs mt-1",
              backgroundImage ? "text-white/80 drop-shadow-sm" :
              variant === "default" ? "text-muted-foreground" : "text-white/60"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "flex-shrink-0 ml-3 p-2 rounded-full",
            backgroundImage ? "text-white drop-shadow-lg bg-white/20 backdrop-blur-sm" :
            variant === "default" ? "text-muted-foreground" : "text-white/80"
          )}>
            {icon}
          </div>
        )}
      </div>
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </Card>
  );
}