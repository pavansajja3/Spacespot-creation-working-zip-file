import { ReactNode } from "react";

interface InputProps {
  type?: "text" | "email" | "password" | "number" | "date" | "tel" | "url";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  className?: string;
}

export function Input({ 
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  error,
  icon,
  disabled = false,
  readOnly = false,
  maxLength,
  className = ""
}: InputProps) {
  const baseInputClasses = `w-full h-[48px] ${icon ? 'pl-12' : 'pl-4'} pr-4 border-2 rounded-lg bg-white text-[16px] text-[#1F2937] placeholder:text-[#6B7280] transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`;
  const borderClasses = error 
    ? "border-red-500 focus:border-red-600" 
    : "border-[#6B7280] focus:border-[#14D8CC] focus:shadow-lg";
  const readOnlyClasses = readOnly ? 'bg-gray-50 cursor-default' : '';
  
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[14px] font-semibold text-[#1F2937]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          className={`${baseInputClasses} ${borderClasses} ${readOnlyClasses} ${className}`}
        />
      </div>
      {error && (
        <span className="text-[12px] font-medium text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
