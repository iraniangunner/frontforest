"use client";

// app/_components/ui/FilterDrawer.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useFilter } from "./FilterProvider";

export default function FilterDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { drawerOpen, closeDrawer } = useFilter();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-[80] flex lg:hidden" dir="rtl">
          {/* overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          {/* panel — از راست */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="relative ml-auto w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
