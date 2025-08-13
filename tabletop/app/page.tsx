'use client';

/**
 * Next.js App Router - Main Page Component
 * This is the entry point for our e-commerce application
 */

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with client-side state
const AppComponent = dynamic(() => import('../App'), { ssr: false });

export default function HomePage() {
  return <AppComponent />;
}