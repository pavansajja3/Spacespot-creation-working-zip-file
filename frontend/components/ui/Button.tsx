import { CSSProperties, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  style?: CSSProperties;
}

export function buttonVariants({ variant = "primary", size = "md", className = "" }: { variant?: "primary" | "secondary" | "outline" | "ghost" | "accent"; size?: "sm" | "md" | "lg"; className?: string } = {}) {
  const baseStyles = "font-semibold transition-all duration-300 flex items-center gap-2 justify-center border-2 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variants = {
    primary: "bg-[#1F2937] text-white border-[#1F2937] hover:bg-[#374151]",
    secondary: "bg-[#6B7280] text-white border-[#6B7280] hover:bg-[#4B5563]",
    outline: "bg-white text-[#1F2937] border-[#6B7280] hover:border-[#14D8CC] hover:text-[#14D8CC]",
    ghost: "bg-transparent text-[#1F2937] border-transparent hover:bg-[#E0F9F7] hover:text-[#14D8CC]",
    accent: "bg-[#14D8CC] text-white border-[#14D8CC] hover:bg-[#0EA59A]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-[13px] rounded-md",
    md: "px-5 py-2.5 text-[15px] rounded-lg",
    lg: "px-7 py-3.5 text-[17px] rounded-lg"
  };
  
  return `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  disabled = false,
  className = "",
  icon,
  style,
}: ButtonProps) {
  const classNames = `${buttonVariants({ variant, size, className })}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames}
      style={style}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
