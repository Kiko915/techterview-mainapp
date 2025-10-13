"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { Version } from "@/components/ui/version";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-4">
          <div className="relative h-full w-full rounded-[20px] overflow-hidden">
            <Image
              src="/assets/auth-gradient.png"
              alt="Authentication background"
              fill
              className="object-cover"
              priority
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
              {/* Top section */}
              <div>
                <p className="text-[#ededed] text-sm tracking-wide">
                  AI POWERED PREPARATION
                </p>
              </div>
              
              {/* Main content */}
              <div className="flex-1 flex items-end">
                <div>
                  <h1 className="font-playfair font-bold text-6xl leading-[64px] drop-shadow-lg mb-6">
                    Master<br />
                    Your Next<br />
                    Interview
                  </h1>
                </div>
              </div>
              
              {/* Bottom section */}
              <div>
                <p className="text-[#ededed] text-sm font-medium max-w-md">
                  Prepare your next interview with the help of Artificial Intelligence, level up your game and stand out with our all in one platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="flex justify-center items-center p-8 lg:p-12">
          <div className="lg:hidden">
            <Logo variant="wordmark" width={80} height={15} />
          </div>
          <div className="hidden lg:block">
            <Logo variant="wordmark" width={176} height={33} />
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <h1 className="font-playfair font-bold text-5xl text-foreground mb-8 text-center">
                Welcome Back!
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground tracking-wide">
                  EMAIL
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="johndoe@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-12 bg-white border border-gray-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground tracking-wide">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••••••••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 bg-white border border-gray-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-xs font-medium italic text-[#1c35b6] hover:underline"
                >
                  Forgot Password
                </Link>
              </div>

              {/* Login Button */}
              <Button 
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium"
              >
                Login
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-4 text-[#d0d0d0] font-medium">OR</span>
                </div>
              </div>

              {/* Google Login Button */}
              <Button 
                type="button"
                variant="outline"
                className="w-full h-12 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-md font-medium shadow-sm"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              {/* Signup Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link 
                    href="/auth/signup" 
                    className="text-[#1c35b6] hover:underline font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Version Footer */}
        <div className="p-8 lg:p-12">
          <Version className="text-right font-light" />
        </div>
      </div>
    </div>
  );
}