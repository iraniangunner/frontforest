"use client";

// app/_components/SessionModal.tsx
import { useState } from "react";
import {
  HiDeviceMobile,
  HiDesktopComputer,
  HiTrash,
  HiExclamationCircle,
} from "react-icons/hi";
import {
  revokeSessionBeforeLoginAction,
  loginAfterRevokeAction,
} from "@/app/_actions/auth";

interface Session {
  id: number;
  device_name: string;
  ip_address: string;
  last_used_at: string | null;
}

interface Props {
  sessions: Session[];
  sessionToken: string;
  message: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const formatDate = (d: string | null) => {
  if (!d) return "نامشخص";
  return new Date(d).toLocaleDateString("fa-IR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DeviceIcon = ({ name }: { name: string }) => {
  const isMobile = name === "iOS" || name === "Android";
  return isMobile ? (
    <HiDeviceMobile className="w-5 h-5 text-gray-500" />
  ) : (
    <HiDesktopComputer className="w-5 h-5 text-gray-500" />
  );
};

export default function SessionModal({
  sessions,
  sessionToken,
  message,
  onSuccess,
  onCancel,
}: Props) {
  const [list, setList] = useState<Session[]>(sessions);
  const [currentToken, setCurrentToken] = useState(sessionToken);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [canLogin, setCanLogin] = useState(false);
  const [error, setError] = useState("");

  const handleRevoke = async (sessionId: number) => {
    setRemovingId(sessionId);
    setError("");

    const res = await revokeSessionBeforeLoginAction(currentToken, sessionId);

    if (!res.success) {
      setError(res.error || "خطا در حذف نشست");
      setRemovingId(null);
      return;
    }

    setList((prev) => prev.filter((s) => s.id !== sessionId));
    if (res.sessionToken) setCurrentToken(res.sessionToken);
    setCanLogin(res.canLogin ?? false);
    setRemovingId(null);
  };

  const handleLogin = async () => {
    setLoggingIn(true);
    setError("");

    const res = await loginAfterRevokeAction(currentToken);

    if (!res.success) {
      setError(res.error || "خطا در ورود");
      setLoggingIn(false);
      return;
    }

    onSuccess();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <HiExclamationCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">مدیریت نشست‌ها</h2>
              <p className="text-xs text-gray-500 mt-0.5">{message}</p>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
          {list.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">
              همه نشست‌ها حذف شدند. می‌توانید وارد شوید.
            </p>
          ) : (
            list.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
                  <DeviceIcon name={session.device_name} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {session.device_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {session.ip_address} — {formatDate(session.last_used_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(session.id)}
                  disabled={removingId === session.id}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                >
                  {removingId === session.id ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <HiTrash className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mb-3 p-3 bg-red-50 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
          >
            انصراف
          </button>
          <button
            onClick={handleLogin}
            disabled={!canLogin || loggingIn}
            className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loggingIn ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال ورود...
              </span>
            ) : (
              "ورود"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
