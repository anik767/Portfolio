'use client';

interface ModernInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export const ModernInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  className = "",
}: ModernInputProps) => {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className={`mb-6 ${className}`}>
      <label 
        htmlFor={inputId} 
        className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          spellCheck={false}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800 bg-white transition-all duration-200 placeholder:text-gray-400"
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          spellCheck={false}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800 bg-white transition-all duration-200 placeholder:text-gray-400"
        />
      )}
    </div>
  );
};

