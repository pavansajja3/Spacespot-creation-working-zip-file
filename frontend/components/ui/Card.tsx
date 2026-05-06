import { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "bordered" | "gradient";
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Card({ 
  children, 
  variant = "default", 
  hoverable = false,
  className = "",
  onClick,
  style,
}: CardProps) {
  const baseStyles = "rounded-lg transition-all duration-300";
  
  const variants = {
    default: "bg-white border spacespot-border-navy shadow-md",
    elevated: "bg-white border-2 spacespot-border-cyan shadow-xl",
    bordered: "bg-white border-2 spacespot-border-navy",
    gradient: "spacespot-gradient-subtle border-2 spacespot-border-cyan shadow-xl"
  };
  
  const hoverStyles = hoverable ? "hover:shadow-2xl hover:scale-[1.02] cursor-pointer" : "";
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
