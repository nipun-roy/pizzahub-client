'use client';

import React, { useState } from 'react';

interface UserAvatarProps {
  name?: string;
  image?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'circle' | 'rounded';
}

export function UserAvatar({
  name = 'User',
  image,
  size = 'md',
  className = '',
  shape = 'circle',
}: UserAvatarProps) {
  const [error, setError] = useState(false);

  const initial = (name?.trim()?.charAt(0) || 'U').toUpperCase();

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  }[size];

  const roundedClasses = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  // Deterministic vibrant gradient based on name character
  const getGradient = (char: string) => {
    const code = char.charCodeAt(0) % 5;
    switch (code) {
      case 0:
        return 'from-pizza-600 to-rose-500';
      case 1:
        return 'from-amber-500 to-orange-600';
      case 2:
        return 'from-emerald-500 to-teal-600';
      case 3:
        return 'from-blue-600 to-indigo-600';
      default:
        return 'from-purple-600 to-pink-600';
    }
  };

  const hasValidImage = image && typeof image === 'string' && image.trim().length > 0 && !error;

  if (hasValidImage) {
    return (
      <img
        src={image}
        alt={name}
        onError={() => setError(true)}
        className={`${sizeClasses} ${roundedClasses} object-cover border border-stone-200/60 dark:border-stone-800 flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} ${roundedClasses} bg-gradient-to-tr ${getGradient(
        initial
      )} text-white font-black flex items-center justify-center flex-shrink-0 shadow-sm select-none ${className}`}
    >
      {initial}
    </div>
  );
}
