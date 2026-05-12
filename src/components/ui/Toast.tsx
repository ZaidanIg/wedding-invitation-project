'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// Simple global toast state
let toastListeners: ((toasts: ToastData[]) => void)[] = [];
let currentToasts: ToastData[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...currentToasts]));
}

export function showToast(type: ToastData['type'], message: string) {
  const id = Math.random().toString(36).substring(2, 9);
  currentToasts.push({ id, type, message });
  notifyListeners();

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 4000);
}

function dismissToast(id: string) {
  currentToasts = currentToasts.filter((t) => t.id !== id);
  notifyListeners();
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

const iconColorMap = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-blue-400',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 p-4 rounded-xl border
              backdrop-blur-xl shadow-2xl
              animate-slide-up
              ${colorMap[toast.type]}
            `}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColorMap[toast.type]}`} />
            <p className="text-sm text-foreground/90 flex-1">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-foreground/40 hover:text-foreground/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
