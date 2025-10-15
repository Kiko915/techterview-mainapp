"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import GuestGuard from "@/components/GuestGuard";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page immediately when /auth is accessed
    router.replace("/auth/login");
  }, [router]);

  // Wrap with GuestGuard to redirect authenticated users
  return (
    <GuestGuard>
      <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center">
        <div className="text-center">
          <Spinner className="h-8 w-8 text-[#354fd2] mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    </GuestGuard>
  );
}
