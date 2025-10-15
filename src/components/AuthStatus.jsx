"use client";

import { useAuth } from '@/lib/useAuth';
import { logOut } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export default function AuthStatus() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-sm text-gray-600">Loading auth status...</div>;
  }

  if (!user) {
    return (
      <div className="text-sm text-gray-600">
        Not authenticated
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <span className="text-gray-600">Signed in as: </span>
        <span className="font-medium">{user.email}</span>
      </div>
      <Button 
        onClick={logOut}
        variant="outline" 
        size="sm"
        className="text-xs"
      >
        Sign Out
      </Button>
    </div>
  );
}