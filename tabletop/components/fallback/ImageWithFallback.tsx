/**
 * ImageWithFallback Component
 * Provides fallback functionality for images that fail to load
 * Uses Next.js Image component for optimization while maintaining fallback behavior
 */

import React, { useState } from 'react';
import Image from 'next/image';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

// Default placeholder image for products
const PLACEHOLDER_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNjY2MiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIG9wYWNpdHk9Ii42IiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyNjAiIHJ4PSIxMCIvPjxwYXRoIGQ9Im0yMCAyMzAgODAtMTAwIDEwMCAxMjAiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxMDAiIHI9IjIwIi8+PC9zdmc+';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  width = 300,
  height = 300,
  className,
  style,
  fill = false,
  sizes,
  priority = false,
  quality = 75,
  unoptimized = false,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.log('Image failed to load:', src);
    setDidError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If image failed to load, show error placeholder
  if (didError) {
    return (
      <div
        className={`inline-flex bg-gray-100 text-center items-center justify-center ${className ?? ''}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height, ...style }}
      >
        <Image
          src={PLACEHOLDER_IMG_SRC}
          alt="Product image not available"
          width={Math.min(width || 300, 150)}
          height={Math.min(height || 300, 150)}
          className="opacity-40"
          unoptimized
        />
      </div>
    );
  }



  // Prepare image properties
  const imageProps = {
    src,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    style,
    onError: handleError,
    onLoad: handleLoad,
    quality,
    priority,
    // Force unoptimized for external images that might have CORS issues
    unoptimized: unoptimized || !src.startsWith('/'),
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && { sizes }),
  };

  return (
    <div 
      className="relative inline-block"
      style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
    >
      {isLoading && (
        <div
          className="absolute inset-0 flex bg-gray-100 animate-pulse items-center justify-center z-10"
        >
          <div className="w-8 h-8 bg-gray-300 rounded opacity-40"></div>
        </div>
      )}
      <Image {...imageProps} />
    </div>
  );
}