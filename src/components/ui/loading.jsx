"use client";

import Image from "next/image";

export function TechTerviewLoader({ message = "Loading...", showSkeleton = false }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-sm mx-auto px-6">
        {/* Animated Logo */}
        <div className="relative mx-auto w-20 h-20">
          {/* Outer Ring Animation */}
          <div className="absolute inset-0 border-4 border-[#354fd2] border-t-transparent rounded-full animate-spin"></div>
          
          {/* Inner Pulse Circle */}
          <div className="absolute inset-2 bg-[#354fd2] rounded-full opacity-10 animate-pulse"></div>
          
          {/* Logo */}
          <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Image
              src="/logo/techterview_symbol_colored.png"
              alt="TechTerview"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Tech<span className="text-[#354fd2]">Terview</span>
          </h2>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#354fd2] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#354fd2] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#354fd2] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 space-y-6">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageLoader({ title, subtitle }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        {/* Spinner */}
        <div className="relative mx-auto w-12 h-12">
          <div className="absolute inset-0 border-3 border-[#354fd2] border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Text */}
        <div>
          {title && <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}