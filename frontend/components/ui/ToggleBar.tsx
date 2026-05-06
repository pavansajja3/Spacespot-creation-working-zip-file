interface ToggleBarOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface ToggleBarProps {
  options: ToggleBarOption[];
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export function ToggleBar({ options, value, onChange, compact = false }: ToggleBarProps) {
  return (
    <div className={`inline-flex bg-[#F3F4F6] rounded-lg p-0.5 w-full ${compact ? 'max-w-xs' : ''}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        
        // Color mapping for different states
        const colorMap: Record<string, { bg: string; text: string; icon: string; border: string }> = {
          verified: { 
            bg: "bg-emerald-500", 
            text: "text-white",
            icon: "text-white",
            border: "border-emerald-600"
          },
          accepted: { 
            bg: "bg-emerald-500", 
            text: "text-white",
            icon: "text-white",
            border: "border-emerald-600"
          },
          pending: { 
            bg: "bg-amber-500", 
            text: "text-white",
            icon: "text-white",
            border: "border-amber-600"
          },
          initiate: { 
            bg: "bg-blue-600", 
            text: "text-white",
            icon: "text-white",
            border: "border-blue-700"
          },
        };

        const selectedColor = option.color && colorMap[option.color] 
          ? colorMap[option.color] 
          : { bg: "bg-[#14D8CC]", text: "text-white", icon: "text-white", border: "border-[#0EA59A]" };

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
              isSelected
                ? `${selectedColor.bg} ${selectedColor.text} shadow-sm border ${selectedColor.border}`
                : "text-[#6B7280] hover:text-[#1F2937] hover:bg-white/40"
            }`}
          >
            {option.icon && (
              <span className={`${isSelected ? selectedColor.icon : "text-[#9CA3AF]"}`}>
                {option.icon}
              </span>
            )}
            <span className="whitespace-nowrap">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
