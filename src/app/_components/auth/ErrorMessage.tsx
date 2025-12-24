interface ErrorMessageProps {
    message: string;
  }
  
  export function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;
  
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
        <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold flex-shrink-0">
          !
        </span>
        {message}
      </div>
    );
  }