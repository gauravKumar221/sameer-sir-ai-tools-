'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Rewards feature is disabled - automatically redirect to dashboard
export default function RewardsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
