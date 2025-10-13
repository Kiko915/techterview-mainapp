import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-16">
        <Logo variant="wordmark" width="200" />
      </div>

      {/* 404 Text */}
      <div className="text-center mb-8">
        <h1 className="font-playfair font-bold text-[128px] leading-[64px] text-foreground mb-8 md:text-[96px] sm:text-[72px]">
          404
        </h1>
        
        <h2 className="font-montserrat font-bold text-[32px] text-foreground mb-4 md:text-[28px] sm:text-[24px]">
          Page Not Found
        </h2>
        
        <p className="font-montserrat text-[16px] text-foreground mb-12 md:text-[14px]">
          Sorry, we can't find the page you are looking for.
        </p>
      </div>

      {/* Back to Home Button */}
      <Button 
        asChild 
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full min-w-[238px] h-[42px] text-sm font-medium transition-all"
      >
        <Link href="/">
          Back to Home
        </Link>
      </Button>

      {/* Copyright */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="font-montserrat font-light text-[11px] text-foreground/70 text-center">
          © 2025 TechTerview. All rights reserved.
        </p>
      </div>
    </div>
  );
}