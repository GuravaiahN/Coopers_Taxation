// stores/useToastStore.ts
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning';

interface ToastState {
  message: string;
  isVisible: boolean;
  type: ToastType;
  duration: number;
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const useToastStore = create<ToastState>((set) => ({
  message: '',
  isVisible: false,
  type: 'success',
  duration: 3000,
  showToast: (message, type = 'success', duration = 3000) =>
    set({
      message,
      type,
      duration,
      isVisible: true,
    }),
  hideToast: () => set({ isVisible: false }),
}));

export default useToastStore;
