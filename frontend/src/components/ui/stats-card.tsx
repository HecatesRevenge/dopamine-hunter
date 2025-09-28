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
  children
}: StatsCardProps) {
  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-game hover:scale-105",
      variantClasses[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className={cn(
            "text-sm font-medium mb-1",
            variant === "default" ? "text-muted-foreground" : "text-white/80"
          )}>
            {title}
          </p>
          <p className="text-2xl font-bold font-poppins">
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs mt-1",
              variant === "default" ? "text-muted-foreground" : "text-white/60"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "flex-shrink-0 ml-3",
            variant === "default" ? "text-muted-foreground" : "text-white/80"
          )}>
            {icon}
          </div>
        )}
      </div>
      {children}
    </Card>
  );
}