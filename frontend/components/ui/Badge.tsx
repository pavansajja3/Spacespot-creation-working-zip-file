import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function Badge({ 
  children, 
  variant = "default", 
  size = "md",
  removable = false,
  onRemove,
  className = ""
}: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1.5 font-semibold rounded-full transition-all duration-300";
  
  const variants = {
    default: "bg-[#6B7280] text-white border-2 border-[#6B7280]",
    accent: "bg-[#14D8CC] text-white border-2 border-[#14D8CC]",
    success: "bg-[#10B981] text-white border-2 border-[#10B981]",
    warning: "bg-[#F59E0B] text-white border-2 border-[#F59E0B]",
    error: "bg-[#EF4444] text-white border-2 border-[#EF4444]",
    info: "bg-[#3B82F6] text-white border-2 border-[#3B82F6]"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-3 py-1 text-[13px]",
    lg: "px-4 py-1.5 text-[14px]"
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="hover:scale-125 transition-transform duration-200"
        >
          ×
        </button>
      )}
    </span>
  );
}
