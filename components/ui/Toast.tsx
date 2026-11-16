"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Toast as ToastType } from "@/lib/context/ToastContext";

const ICONS: Record<ToastType["type"], string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const STYLES: Record<ToastType["type"], string> = {
  success: "bg-green-50 border-green-400 text-green-800",
  error: "bg-red-50 border-red-400 text-red-800",
  info: "bg-blue-50 border-blue-400 text-blue-800",
  warning: "bg-amber-50 border-amber-400 text-amber-800",
};

const ICON_STYLES: Record<ToastType["type"], string> = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  warning: "bg-amber-100 text-amber-700",
};

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={toast.id}
        initial={{ opacity: 0, x: 60, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 60, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`flex min-w-[280px] max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${STYLES[toast.type]}`}
        role="alert"
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${ICON_STYLES[toast.type]}`}
        >
          {ICONS[toast.type]}
        </span>
        <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="ml-1 shrink-0 text-current opacity-50 transition hover:opacity-100"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
