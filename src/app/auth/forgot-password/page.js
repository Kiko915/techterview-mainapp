"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Version } from "@/components/ui/version";
import { Logo } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* TechTerview Logo */}
      <div className="mb-16">
        <Logo
          variant="wordmark"
          priority
          className="mx-auto"
          width="200"
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-lg space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground font-playfair">
            Forgot Password?
          </h2>
        </div>

        {/* Form Card */}
        <Card className="bg-card border-border w-full">
          <CardContent className="pt-8 pb-6 px-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Instructions */}
                <p className="text-sm text-muted-foreground font-medium font-montserrat">
                  Enter the email address you registered with TechTerview
                </p>

                {/* Email Input */}
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium font-montserrat"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Check your email
                </h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Send another email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <a href="/auth/login">
              ← Back to Login
            </a>
          </Button>
        </div>
      </div>

      {/* Version */}
      <div className="fixed bottom-4 right-4">
        <Version />
      </div>
    </div>
  );
}