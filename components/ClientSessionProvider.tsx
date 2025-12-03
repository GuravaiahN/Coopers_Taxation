// // utils/SessionProvider.tsx
// 'use client';
// import React, { useEffect } from 'react';
// import { SessionProvider } from 'next-auth/react';
// import useSessionStore from '@/stores/useSessionStore';

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const fetchSession = useSessionStore((state) => state.fetchSession);

//   // Initialize session state on the client
//   useEffect(() => {
//     fetchSession();
//   }, [fetchSession]);

//   return <SessionProvider>{children}</SessionProvider>;
// };

// export default AuthProvider;

// utils/SessionProvider.tsx
'use client';
import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import useSessionStore from '@/stores/useSessionStore';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchSession = useSessionStore((state) => state.fetchSession);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchSession(); // Only fetch session on the client side
    }
  }, [fetchSession]);

  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
