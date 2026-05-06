import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconColor?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  hoverable?: boolean;
  className?: string;
}

export function MetricCard({ 
  title,
  value,
  icon,
  iconColor = "var(--spacespot-cyan-primary)",
  trend,
  hoverable = true,
  className = ""
}: MetricCardProps) {
  return (
    <div className={`bg-white p-4 rounded-lg border border-[#6B7280] shadow-md transition-all duration-300 ${
      hoverable ? "hover:border-[#14D8CC] hover:scale-105 hover:shadow-lg" : ""
    } ${className}`}>
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[12px] text-[#6B7280] uppercase tracking-wide font-medium">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-[24px] font-bold text-[#1F2937]">
              {value}
            </p>
            {trend && (
              <span className={`text-[12px] font-semibold ${
                trend.direction === "up" ? "text-[#10B981]" : "text-[#EF4444]"
              }`}>
                {trend.direction === "up" ? "↑" : "↓"} {trend.value}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
