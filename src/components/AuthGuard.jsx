"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { getUserByUID } from '@/lib/firestore';

export default function AuthGuard({ children, requireOnboarding = false }) {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!authLoading && user) {
        try {
          const profile = await getUserByUID(user.uid);
          setUserProfile(profile);
          
          // If requireOnboarding is true and user hasn't completed onboarding
          if (requireOnboarding && (!profile || !profile.onboardingCompleted)) {
            router.push('/onboarding');
            return;
          }
          
          // If user is on onboarding page but has already completed it
          if (!requireOnboarding && profile && profile.onboardingCompleted && 
              pathname === '/onboarding') {
            router.push('/dashboard');
            return;
          }
          
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else if (!authLoading && !user) {
        // Not authenticated, redirect to login
        router.push('/auth/login');
      }
      
      setProfileLoading(false);
    };

    checkUserProfile();
  }, [user, authLoading, router, requireOnboarding, pathname]);

  // Show loading while checking authentication and profile
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until we've verified the user's authentication and profile status
  if (!user) {
    return null;
  }

  return children;
}