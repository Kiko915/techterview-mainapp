"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { getUserByUID } from '@/lib/firestore';
import { Spinner } from '@/components/ui/spinner';

export default function GuestGuard({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authLoading) {
        return; // Still loading auth state
      }
      
      if (!user) {
        // Not authenticated, allow access to auth pages
        setProfileLoading(false);
        return;
      }
      
      try {
        // User is authenticated, check onboarding status
        const profile = await getUserByUID(user.uid);
        setUserProfile(profile);
        
        if (profile && profile.onboardingCompleted) {
          // User is authenticated and onboarded, redirect to dashboard
          router.push('/dashboard');
          return;
        } else {
          // User is authenticated but not onboarded, redirect to onboarding
          router.push('/onboarding');
          return;
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        // If there's an error, assume they need onboarding
        router.push('/onboarding');
        return;
      }
    };

    checkAuthStatus();
  }, [user, authLoading, router]);

  // Show loading while checking authentication status
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="w-8 h-8 mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children (auth pages) if user is not authenticated
  if (!user) {
    return children;
  }

  // User is authenticated, don't render auth pages (redirect will happen)
  return null;
}