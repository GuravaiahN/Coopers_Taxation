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
  isInitialized: boolean;
  fetchingPromise: Promise<void> | null;
  fetchSession: () => Promise<void>;
  updateSession: (updates: Partial<Session['user']>) => void;
  logout: () => Promise<void>;
}

const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  loading: true,
  isInitialized: false,
  fetchingPromise: null,
  fetchSession: async () => {
    const state = get();
    
    // Prevent multiple simultaneous calls
    if (state.fetchingPromise) {
      return state.fetchingPromise;
    }
    
    // Don't fetch if already initialized and not loading
    if (state.isInitialized && !state.loading) {
      return;
    }
    
    const fetchingPromise = (async () => {
      try {
        set({ loading: true });
        const session = await getSession();
        set({ 
          session, 
          loading: false, 
          isInitialized: true,
          fetchingPromise: null 
        });
      } catch (error) {
        console.error('Session fetch error:', error);
        set({ 
          session: null, 
          loading: false, 
          isInitialized: true,
          fetchingPromise: null 
        });
      }
    })();
    
    set({ fetchingPromise });
    return fetchingPromise;
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
  logout: async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/' });
    set({ 
      session: null, 
      loading: false, 
      isInitialized: true,
      fetchingPromise: null 
    });
  },
}));

export default useSessionStore;
