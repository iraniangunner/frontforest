"use client";

const isMobile = (v: string) => /^09[0-9]{9}$/.test(v);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type InputState = "idle" | "mobile" | "email" | "invalid";

function getInputState(value: string): InputState {
  if (!value) return "idle";
  if (isMobile(value)) return "mobile";
  if (isEmail(value)) return "email";
  if (value.length > 2) return "invalid";
  return "idle";
}

interface Props {
  identifier: string;
  setIdentifier: (v: string) => void;
  error?: string;
  action: (payload: FormData) => void;
}

export function IdentifierForm({
  identifier,
  setIdentifier,
  error,
  action,
}: Props) {
  const state = getInputState(identifier);

  const hint =
    state === "mobile"
      ? "✓ شماره موبایل - کد SMS ارسال می‌شود"
      : state === "email"
        ? "✓ ایمیل - کد به ایمیل شما ارسال می‌شود"
        : state === "invalid"
          ? "یک شماره موبایل (09...) یا ایمیل معتبر وارد کنید"
          : "شماره موبایل یا ایمیل خود را وارد کنید";

  const hintColor =
    state === "mobile" || state === "email"
      ? "text-emerald-600"
      : state === "invalid"
        ? "text-red-500"
        : "text-slate-400";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="identifier" value={identifier} />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 text-right">
          ورود / ثبت‌نام
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="09123456789 یا email@example.com"
          dir="ltr"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-left placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition text-sm"
        />
        <p className={`text-xs text-right transition-colors ${hintColor}`}>
          {hint}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-right bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state !== "mobile" && state !== "email"}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium text-sm shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ارسال کد تایید
      </button>
    </form>
  );
}
