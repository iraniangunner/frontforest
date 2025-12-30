"use client";

import { HiOutlineUser } from "react-icons/hi";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">ادمین</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <HiOutlineUser className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
