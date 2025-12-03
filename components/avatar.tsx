// app/components/Avatar.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useSessionStore from '../stores/useSessionStore'; // Import global session store

const Avatar = () => {
  const router = useRouter();
  const { session } = useSessionStore(); // Use session from Zustand store

  const handleSettingsClick = () => {
    const settingsRoute = session?.user?.isAdmin
      ? '/admin-settings'
      : '/user-settings';
    router.push(settingsRoute);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Avatar Image or Fallback to Initial */}
      <div
        className="w-10 h-10 rounded-full bg-[#C84B31] flex items-center justify-center text-white font-bold cursor-pointer"
        onClick={handleSettingsClick}
      >
        {session?.user?.image ? (
          <Image
            src={`/api/avatar/${session.user.image}`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
            width={64}
            height={64}
            unoptimized
          />
        ) : (
          // Fallback to first letter of email if no image is available
          <span>{session?.user?.email?.charAt(0).toUpperCase() || 'U'}</span>
        )}
      </div>

      {/* Settings Icon */}
      <button
        className="p-2 bg-[#C84B31] text-white rounded-full"
        onClick={handleSettingsClick}
        aria-label="Settings"
      >
        ⚙️
      </button>
    </div>
  );
};

export default Avatar;
