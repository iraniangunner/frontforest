// "use client";

// import { useState, useEffect, useRef } from "react";
// import { HiSearch, HiX } from "react-icons/hi";

// interface SearchBarProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// export default function SearchBar({
//   value,
//   onChange,
//   placeholder = "جستجو در کامپوننت‌ها...",
// }: SearchBarProps) {
//   const [localValue, setLocalValue] = useState(value);
//   const [isFocused, setIsFocused] = useState(false);
//   const debounceRef = useRef<NodeJS.Timeout>();
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     setLocalValue(value);
//   }, [value]);

//   const handleChange = (newValue: string) => {
//     setLocalValue(newValue);

//     // Debounce search
//     if (debounceRef.current) {
//       clearTimeout(debounceRef.current);
//     }
//     debounceRef.current = setTimeout(() => {
//       onChange(newValue);
//     }, 500);
//   };

//   const handleClear = () => {
//     setLocalValue("");
//     onChange("");
//     inputRef.current?.focus();
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Escape") {
//       handleClear();
//       inputRef.current?.blur();
//     }
//   };

//   return (
//     <div className="relative group">
//       {/* Glow effect on focus */}
//       <div
//         className={`absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur-lg transition-opacity duration-300 ${
//           isFocused ? "opacity-20" : "opacity-0"
//         }`}
//       />

//       {/* Search container */}
//       <div
//         className={`relative flex items-center bg-white rounded-xl border-2 transition-all duration-300 ${
//           isFocused
//             ? "border-teal-500 shadow-lg shadow-teal-500/10"
//             : "border-gray-200 hover:border-gray-300"
//         }`}
//       >
//         {/* Search icon */}
//         <div
//           className={`flex items-center justify-center w-12 h-12 transition-colors duration-200 ${
//             isFocused ? "text-teal-500" : "text-gray-400"
//           }`}
//         >
//           <HiSearch className="w-5 h-5" />
//         </div>

//         {/* Input */}
//         <input
//           ref={inputRef}
//           type="text"
//           value={localValue}
//           onChange={(e) => handleChange(e.target.value)}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           onKeyDown={handleKeyDown}
//           placeholder={placeholder}
//           className="flex-1 py-3.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
//         />

//         {/* Clear button & keyboard hint */}
//         <div className="flex items-center gap-2 pl-3">
//           {/* Clear button */}
//           {localValue && (
//             <button
//               onClick={handleClear}
//               className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
//               type="button"
//             >
//               <HiX className="w-4 h-4" />
//             </button>
//           )}

//           {/* Keyboard shortcut hint - hidden on mobile */}
//           {!localValue && (
//             <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
//               <kbd className="px-2 py-1 bg-gray-100 rounded-md font-mono text-gray-500">
//                 ESC
//               </kbd>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Searching indicator */}
//       {localValue && localValue !== value && (
//         <div className="absolute left-14 top-1/2 -translate-y-1/2">
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiSearch, HiX } from "react-icons/hi";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "جستجو در کامپوننت‌ها...",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialValue = searchParams.get("q") || "";
  const [localValue, setLocalValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with URL changes
  useEffect(() => {
    setLocalValue(searchParams.get("q") || "");
  }, [searchParams]);

  const updateUrl = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newValue) {
      params.set("q", newValue);
    } else {
      params.delete("q");
    }
    
    // Reset to page 1 when searching
    params.delete("page");
    
    const queryString = params.toString();
    router.push(queryString ? `/components?${queryString}` : "/components", {
      scroll: false,
    });
    setIsSearching(false);
  };

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setIsSearching(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      updateUrl(newValue);
    }, 500);
  };

  const handleClear = () => {
    setLocalValue("");
    updateUrl("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative group">
      {/* Glow effect on focus */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur-lg transition-opacity duration-300 ${
          isFocused ? "opacity-20" : "opacity-0"
        }`}
      />

      {/* Search container */}
      <div
        className={`relative flex items-center bg-white rounded-xl border-2 transition-all duration-300 ${
          isFocused
            ? "border-teal-500 shadow-lg shadow-teal-500/10"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Search icon */}
        <div
          className={`flex items-center justify-center w-12 h-12 transition-colors duration-200 ${
            isFocused ? "text-teal-500" : "text-gray-400"
          }`}
        >
          <HiSearch className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 py-3.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
        />

        {/* Clear button & keyboard hint */}
        <div className="flex items-center gap-2 pl-3">
          {/* Clear button */}
          {localValue && (
            <button
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              type="button"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}

          {/* Keyboard shortcut hint - hidden on mobile */}
          {!localValue && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-2 py-1 bg-gray-100 rounded-md font-mono text-gray-500">
                ESC
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* Searching indicator */}
      {isSearching && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}