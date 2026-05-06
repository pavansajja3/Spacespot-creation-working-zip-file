import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: string[] | DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
}

export function Dropdown({ 
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  icon,
  className = ""
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize options to always have value and label
  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Find the display label for the current value
  const displayValue = normalizedOptions.find(opt => opt.value === value)?.label || value;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[14px] font-semibold text-[#1F2937]">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-[16px] font-semibold border-2 rounded-lg transition-all duration-300 ${
            isOpen 
              ? "bg-[#14D8CC] text-white border-[#14D8CC] shadow-lg" 
              : "bg-white text-[#1F2937] border-[#6B7280] hover:border-[#14D8CC]"
          }`}
        >
          <div className="flex items-center gap-2">
            {icon && <span>{icon}</span>}
            <span>{displayValue || placeholder}</span>
          </div>
          <ChevronDown 
            size={18} 
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 left-0 w-full bg-white border-2 border-[#14D8CC] rounded-lg shadow-xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
            {normalizedOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-[15px] transition-all duration-200 ${
                  option.value === value
                    ? "bg-[#14D8CC] text-white font-semibold"
                    : "text-[#1F2937] hover:bg-[#E0F9F7] hover:text-[#14D8CC]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
