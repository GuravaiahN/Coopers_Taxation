// // stores/useSessionStore.ts
// import { create } from 'zustand';
// import { Session } from 'next-auth';
// import { getSession } from 'next-auth/react';

// interface SessionState {
//   session: Session | null;
//   loading: boolean;
//   fetchSession: () => Promise<void>;
// }

// const useSessionStore = create<SessionState>((set, get) => ({
//   session: null,
//   loading: true,
//   fetchSession: async () => {
//     if (get().session) return; // Check if session already exists to prevent re-fetching
//     set({ loading: true });
//     const session = await getSession();
//     set({ session, loading: false });
//   },
// }));

// export default useSessionStore;

// stores/useSessionStore.ts
import { create } from 'zustand';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

interface SessionState {
  session: Session | null;
  loading: boolean;
  fetchSession: () => Promise<void>;
  updateSession: (updates: Partial<Session['user']>) => void;
}

const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  loading: true,
  fetchSession: async () => {
    set({ loading: true });
    const session = await getSession();
    set({ session, loading: false });
  },
  updateSession: (updates) => {
    set((state) => ({
      session: {
        ...state.session,
        user: {
          ...state.session?.user,
          ...updates,
        },
      } as Session,
    }));
  },
}));

export default useSessionStore;
