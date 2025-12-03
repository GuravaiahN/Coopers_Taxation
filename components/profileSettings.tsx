// app/components/ProfileSettings.tsx
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Toast from './toast';
import { FaSpinner } from 'react-icons/fa';
import useUserProfileStore from '@/stores/useUserProfileStore';
import useToastStore from '@/stores/useToastStore';
import useSessionStore from '@/stores/useSessionStore';
import { Session } from 'next-auth'; // Import Session type

const ProfileSettings = () => {
  const { session, updateSession } = useSessionStore();
  const {
    avatar,
    avatarUrl,
    phone,
    setAvatar,
    setAvatarUrl,
    setPhone,
    loading,
    setLoading,
  } = useUserProfileStore();
  const { showToast, hideToast, isVisible } = useToastStore();

  useEffect(() => {
    if (session?.user?.image) {
      setAvatarUrl(`/api/avatar/${session.user.image}`);
    }
    if (session?.user?.phone) {
      setPhone(session.user.phone);
    }
  }, [session, setAvatarUrl, setPhone]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare updates object
    const updates: Partial<Session['user']> = {};

    if (avatar) {
      const formData = new FormData();
      formData.append('avatar', avatar);

      try {
        const res = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();

        if (result.success) {
          const newImageId = result.imageId;
          setAvatarUrl(`/api/avatar/${newImageId}`);
          // Update session in the store
          updateSession({ image: newImageId });
          showToast('Avatar updated successfully', 'success');
        } else {
          showToast('Failed to update avatar', 'error');
        }
      } catch {
        showToast('An error occurred while uploading the avatar', 'error');
      }
    }

    if (phone !== session?.user?.phone) {
      try {
        const res = await fetch('/api/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        });
        const result = await res.json();

        if (result.success) {
          // Update session in the store
          updateSession({ phone });
          showToast('Profile updated successfully', 'success');
        } else {
          showToast('Failed to update phone number', 'error');
        }
      } catch {
        showToast('An error occurred while updating the profile', 'error');
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-6 shadow-lg w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 mx-auto">
      <h2 className="text-2xl font-poppins text-[#C84B31] mb-6">
        Profile Settings
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Avatar Upload Section */}
        <div className="mb-6">
          <label className="block text-lg font-poppins text-gray-700 mb-2">
            Avatar:
          </label>
          <div className="flex items-center">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
                width={64}
                height={64}
                unoptimized
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-poppins text-white">
                {session?.user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="ml-4 bg-[#C84B31] text-white px-3 py-2 rounded-lg cursor-pointer font-poppins"
            >
              Choose File
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label="Upload Avatar"
            />
          </div>
        </div>

        {/* Email Section */}
        <div className="mb-6">
          <label className="block text-lg font-poppins text-gray-700 mb-2">
            Email:
          </label>
          <input
            type="email"
            value={session?.user?.email || ''}
            disabled
            className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md font-poppins focus:outline-none focus:ring-2 focus:ring-[#C84B31]"
          />
        </div>

        {/* Phone Number Section */}
        <div className="mb-6">
          <label className="block text-lg font-poppins text-gray-700 mb-2">
            Phone Number:
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:outline-none focus:ring-2 focus:ring-[#C84B31]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-[#C84B31] text-white px-4 py-2 rounded-lg font-poppins transition-all duration-300 ease-in-out ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#a84028]'
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <FaSpinner className="animate-spin" />
              <span>Saving...</span>
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>

      {isVisible && <Toast />}
    </div>
  );
};

export default ProfileSettings;
