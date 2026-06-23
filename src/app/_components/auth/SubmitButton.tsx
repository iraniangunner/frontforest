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
                 bg-[#A72F3B] hover:bg-[#86262F] active:bg-[#641C23]
                 disabled:bg-[#D6D6D6]
                 text-white font-medium text-[16px] rounded-xl
                 transition-colors duration-200 disabled:cursor-not-allowed"
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
