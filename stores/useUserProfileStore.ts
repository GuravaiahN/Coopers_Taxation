// import { create } from 'zustand';
// import { Session } from 'next-auth';

// interface UserProfileState {
//   session: Session | null;
//   loading: boolean;
//   updateProfile: (data: { phone: string; avatarUrl?: string }) => void;
// }

// const useUserProfileStore = create<UserProfileState>((set) => ({
//   session: null,
//   loading: true,
//   updateProfile: (data) => {
//     set((state) => ({
//       session: {
//         ...state.session,
//         user: {
//           ...state.session?.user,
//           phone: data.phone,
//           image: data.avatarUrl || state.session?.user?.image,
//         },
//       } as Session,
//     }));
//   },
// }));

// export default useUserProfileStore;

import { create } from 'zustand';
import { Session } from 'next-auth';

interface UserProfileState {
  session: Session | null;
  phone: string;
  avatar: File | null;
  avatarUrl: string | null;
  loading: boolean;
  toastMessage: string;
  toastType: 'success' | 'error' | 'warning';
  isToastVisible: boolean;
  setSession: (session: Session) => void;
  setPhone: (phone: string) => void;
  setAvatar: (avatar: File | null) => void;
  setAvatarUrl: (url: string | null) => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
  hideToast: () => void;
  updateProfile: (data: { phone: string; avatarUrl?: string }) => void;
}

const useUserProfileStore = create<UserProfileState>((set) => ({
  session: null,
  phone: '',
  avatar: null,
  avatarUrl: null,
  loading: false,
  toastMessage: '',
  toastType: 'success',
  isToastVisible: false,

  setSession: (session) => set({ session }),
  setPhone: (phone) => set({ phone }),
  setAvatar: (avatar) => set({ avatar }),
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setLoading: (loading) => set({ loading }),

  showToast: (message, type) =>
    set({ toastMessage: message, toastType: type, isToastVisible: true }),
  hideToast: () => set({ isToastVisible: false }),

  updateProfile: (data) => {
    set((state) => ({
      session: {
        ...state.session,
        user: {
          ...state.session?.user,
          phone: data.phone,
          image: data.avatarUrl || state.session?.user?.image,
        },
      } as Session,
      phone: data.phone,
      avatarUrl: data.avatarUrl || state.avatarUrl,
    }));
  },
}));

export default useUserProfileStore;
