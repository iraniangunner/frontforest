"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@heroui/react";
import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  labelPending: string;
  labelIdle: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SubmitButton({
  labelPending,
  labelIdle,
  disabled,
  icon = <ArrowRight className="w-5 h-5" />,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 
                 bg-gradient-to-r from-emerald-500 to-teal-600 
                 hover:from-emerald-600 hover:to-teal-700 
                 disabled:from-slate-300 disabled:to-slate-400
                 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 
                 hover:shadow-xl hover:shadow-emerald-500/30 disabled:shadow-none
                 transition-all duration-200 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Spinner size="sm" color="white" />
          <span>{labelPending}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{labelIdle}</span>
        </>
      )}
    </button>
  );
}