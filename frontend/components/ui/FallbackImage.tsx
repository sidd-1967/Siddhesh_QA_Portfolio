'use client';
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface FallbackImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackText?: string;
}

export default function FallbackImage({ src, fallbackText = 'SDG', alt, className = '', style, ...props }: FallbackImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div 
        className={`fallback-img-container ${className}`} 
        style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span style={{ 
          fontFamily: 'var(--font-heading)', 
          fontWeight: 800, 
          fontSize: '1.25rem', 
          color: 'var(--color-text-muted)',
          letterSpacing: '0.05em'
        }}>
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || fallbackText}
      className={className}
      style={style}
      onError={() => setError(true)}
      {...props}
    />
  );
}
