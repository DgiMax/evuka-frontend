"use client";

import Image from 'next/image';
import React, { useState } from 'react';

// This is a Client Component because it uses state and browser event handlers (onError)

export function ProfileImage() {
  const [imageError, setImageError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Only set the placeholder if the original image failed to load
    if (!imageError) {
      e.currentTarget.src = 'https://placehold.co/40x40/f0f0f0/888888?text=U';
      setImageError(true);
    }
  };

  // Note: We use the default.JPG path. If the image fails, handleError is triggered.
  const srcPath = "/default.JPG";

  return (
    <div className="relative w-12 h-12 rounded-full overflow-hidden border-1 border-gray-300">
      <Image 
        src={srcPath} 
        alt="User Profile" 
        fill 
        style={{ objectFit: 'cover' }}
        // The event handler is now safely contained within this Client Component
        onError={handleError}
      />
    </div>
  );
}
